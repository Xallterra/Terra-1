'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser, canModerate, type AuthUser } from '@/lib/auth';
import { createCommentSchema, createPostSchema, reportSchema, voteSchema } from '@/lib/community-validation';
import { hasDatabaseUrl, prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { slugify } from '@/lib/slug';

function formString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export async function createPostAction(formData: FormData) {
  const user = await requireUser();
  const limited = await rateLimit(`post:${user.id}`, 6, 60);
  if (!limited.allowed) throw new Error('Posting too quickly. Please wait before creating another thread.');

  const parsed = createPostSchema.parse({
    title: formString(formData, 'title'),
    body: formString(formData, 'body'),
    type: formString(formData, 'type') ?? 'QUESTION',
    category: formString(formData, 'category') ?? 'Endpoint',
    tags: formString(formData, 'tags'),
    affectedVendor: formString(formData, 'affectedVendor'),
    affectedProduct: formString(formData, 'affectedProduct'),
    environment: formString(formData, 'environment'),
    severity: formString(formData, 'severity') ?? 'MEDIUM',
    codeSnippet: formString(formData, 'codeSnippet'),
  });

  const slug = `${slugify(parsed.title)}-${Date.now().toString(36)}`;
  if (!hasDatabaseUrl()) {
    revalidatePath('/');
    redirect(`/posts/${slug}`);
  }

  const db = prisma as any;
  await ensureUser(user);
  const tags = parseTags(parsed.tags);
  await db.post.create({
    data: {
      slug,
      title: parsed.title,
      body: parsed.body,
      type: parsed.type,
      category: parsed.category,
      affectedVendor: parsed.affectedVendor,
      affectedProduct: parsed.affectedProduct,
      environment: parseEnvironment(parsed.environment),
      severity: parsed.severity,
      authorId: user.id,
      codeSnippets: parsed.codeSnippet ? [{ label: 'snippet', value: parsed.codeSnippet }] : undefined,
      tags: {
        create: await Promise.all(
          tags.map(async (tag) => ({
            tag: {
              connectOrCreate: {
                where: { slug: slugify(tag) },
                create: { slug: slugify(tag), name: tag },
              },
            },
          }))
        ),
      },
    },
  });

  await db.profile.updateMany({ where: { userId: user.id }, data: { postsCount: { increment: 1 }, reputation: { increment: 2 }, reputationScore: { increment: 2 } } });
  revalidateTag('community');
  redirect(`/posts/${slug}`);
}

export async function createCommentAction(formData: FormData) {
  const user = await requireUser();
  const limited = await rateLimit(`comment:${user.id}`, 20, 60);
  if (!limited.allowed) throw new Error('Commenting too quickly. Please wait before replying again.');

  const parsed = createCommentSchema.parse({
    postId: formString(formData, 'postId'),
    parentId: formString(formData, 'parentId'),
    body: formString(formData, 'body'),
    codeSnippet: formString(formData, 'codeSnippet'),
  });

  if (hasDatabaseUrl()) {
    await ensureUser(user);
    const db = prisma as any;
    await db.comment.create({
      data: {
        postId: parsed.postId,
        parentId: parsed.parentId,
        body: parsed.body,
        authorId: user.id,
        codeSnippets: parsed.codeSnippet ? [{ label: 'snippet', value: parsed.codeSnippet }] : undefined,
      },
    });
    await db.profile.updateMany({ where: { userId: user.id }, data: { reputation: { increment: 1 }, reputationScore: { increment: 1 } } });
  }

  revalidateTag('community');
  revalidatePath(`/posts/${formString(formData, 'slug') ?? ''}`);
}

export async function voteAction(formData: FormData) {
  const user = await requireUser();
  const parsed = voteSchema.parse({
    targetType: formString(formData, 'targetType'),
    targetId: formString(formData, 'targetId'),
  });

  if (hasDatabaseUrl()) {
    await ensureUser(user);
    const db = prisma as any;
    if (parsed.targetType === 'POST') {
      await db.vote.upsert({
        where: { userId_postId: { userId: user.id, postId: parsed.targetId } },
        create: { userId: user.id, postId: parsed.targetId, targetType: 'POST', value: 1 },
        update: { value: 1 },
      });
    } else {
      await db.vote.upsert({
        where: { userId_commentId: { userId: user.id, commentId: parsed.targetId } },
        create: { userId: user.id, commentId: parsed.targetId, targetType: 'COMMENT', value: 1 },
        update: { value: 1 },
      });
    }
  }

  revalidateTag('community');
}

export async function bookmarkAction(formData: FormData) {
  const user = await requireUser();
  const postId = formString(formData, 'postId');
  if (!postId) return;

  if (hasDatabaseUrl()) {
    await ensureUser(user);
    const db = prisma as any;
    await db.bookmark.upsert({
      where: { userId_postId: { userId: user.id, postId } },
      create: { userId: user.id, postId },
      update: {},
    });
  }
  revalidateTag('community');
}

export async function acceptSolutionAction(formData: FormData) {
  const user = await requireUser();
  const postId = formString(formData, 'postId');
  const commentId = formString(formData, 'commentId');
  if (!postId || !commentId || !hasDatabaseUrl()) return;

  const db = prisma as any;
  const post = await db.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (post?.authorId !== user.id && !canModerate(user.role)) throw new Error('Only the author or moderators can accept a solution.');

  await db.$transaction([
    db.comment.updateMany({ where: { postId }, data: { isAccepted: false } }),
    db.comment.update({ where: { id: commentId }, data: { isAccepted: true } }),
    db.post.update({ where: { id: postId }, data: { status: 'SOLVED', acceptedCommentId: commentId } }),
  ]);
  revalidateTag('community');
}

export async function reportAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reportSchema.parse({
    targetType: formString(formData, 'targetType'),
    targetId: formString(formData, 'targetId'),
    reason: formString(formData, 'reason'),
    details: formString(formData, 'details'),
  });

  if (hasDatabaseUrl()) {
    await ensureUser(user);
    const db = prisma as any;
    await db.report.create({
      data: {
        reporterId: user.id,
        targetType: parsed.targetType,
        reason: parsed.reason,
        details: parsed.details,
        postId: parsed.targetType === 'POST' ? parsed.targetId : undefined,
        commentId: parsed.targetType === 'COMMENT' ? parsed.targetId : undefined,
      },
    });
  }
  revalidatePath('/admin');
}

async function ensureUser(user: AuthUser) {
  const db = prisma as any;
  await db.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      profile: { create: { displayName: user.username, title: 'Makriva Member' } },
    },
    update: { role: user.role },
  });
}

function parseTags(tags?: string): string[] {
  return (tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function parseEnvironment(environment?: string): Record<string, string> {
  if (!environment) return {};
  return Object.fromEntries(
    environment
      .split('\n')
      .map((line) => line.split(':').map((part) => part.trim()))
      .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
      .map(([key, ...value]) => [key, value.join(':')])
  );
}
