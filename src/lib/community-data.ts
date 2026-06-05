/* eslint-disable @typescript-eslint/no-explicit-any */

import { unstable_cache } from 'next/cache';
import type { CommunityComment, CommunityPost, CommunityProfile, FeedSort } from '@/types/community';
import { communityComments, communityPosts, communityProfiles } from '@/lib/community-seed';
import { hasDatabaseUrl, prisma } from '@/lib/prisma';

type FeedOptions = {
  category?: string;
  tag?: string;
  query?: string;
  sort?: FeedSort;
  cursor?: string;
  take?: number;
};

export const getCommunityFeed = unstable_cache(
  async (options: FeedOptions = {}): Promise<CommunityPost[]> => {
    if (!hasDatabaseUrl()) return filterSeedPosts(options);

    try {
      const db = prisma as any;
      const where: any = { deletedAt: null, isHidden: false };
      if (options.category) where.category = options.category;
      if (options.tag) where.tags = { some: { tag: { slug: options.tag } } };
      if (options.sort === 'unresolved') where.status = { in: ['OPEN', 'INVESTIGATING'] };
      if (options.sort === 'solved') where.status = 'SOLVED';
      if (options.sort === 'critical') where.severity = 'CRITICAL';
      if (options.query) {
        where.OR = [
          { title: { contains: options.query, mode: 'insensitive' } },
          { body: { contains: options.query, mode: 'insensitive' } },
          { affectedProduct: { contains: options.query, mode: 'insensitive' } },
          { affectedVendor: { contains: options.query, mode: 'insensitive' } },
        ];
      }

      const posts = await db.post.findMany({
        where,
        take: options.take ?? 20,
        ...(options.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
        orderBy: orderByFor(options.sort),
        include: {
          author: { include: { profile: true } },
          tags: { include: { tag: true } },
          acceptedComment: { include: { author: { include: { profile: true } }, votes: true } },
          votes: true,
          comments: { select: { id: true } },
        },
      });
      return posts.map(mapPost);
    } catch (error) {
      console.error('Community feed fallback:', error);
      return filterSeedPosts(options);
    }
  },
  ['community-feed'],
  { revalidate: 30, tags: ['community'] }
);

export async function getPostBySlug(slug: string): Promise<CommunityPost | undefined> {
  if (!hasDatabaseUrl()) return communityPosts.find((post) => post.slug === slug);

  try {
    const db = prisma as any;
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        author: { include: { profile: true } },
        tags: { include: { tag: true } },
        acceptedComment: { include: { author: { include: { profile: true } }, votes: true } },
        votes: true,
        comments: { select: { id: true } },
      },
    });
    return post ? mapPost(post) : undefined;
  } catch {
    return communityPosts.find((post) => post.slug === slug);
  }
}

export async function getCommentsForPost(postId: string): Promise<CommunityComment[]> {
  if (!hasDatabaseUrl()) return communityComments.filter((comment) => comment.postId === postId);

  try {
    const db = prisma as any;
    const comments = await db.comment.findMany({
      where: { postId, parentId: null, deletedAt: null, isHidden: false },
      orderBy: [{ isAccepted: 'desc' }, { createdAt: 'asc' }],
      include: {
        author: { include: { profile: true } },
        votes: true,
        replies: {
          where: { deletedAt: null, isHidden: false },
          orderBy: { createdAt: 'asc' },
          include: { author: { include: { profile: true } }, votes: true },
        },
      },
    });
    return comments.map(mapComment);
  } catch {
    return communityComments.filter((comment) => comment.postId === postId);
  }
}

export async function getProfileByUsername(username: string): Promise<CommunityProfile | undefined> {
  if (!hasDatabaseUrl()) return communityProfiles.find((profile) => profile.username === username);

  try {
    const db = prisma as any;
    const user = await db.user.findUnique({ where: { username }, include: { profile: true } });
    return user ? mapProfile(user) : undefined;
  } catch {
    return communityProfiles.find((profile) => profile.username === username);
  }
}

export async function getTopProfiles(): Promise<CommunityProfile[]> {
  if (!hasDatabaseUrl()) return [...communityProfiles].sort((a, b) => b.reputation - a.reputation);
  try {
    const db = prisma as any;
    const users = await db.user.findMany({ take: 5, include: { profile: true }, orderBy: { profile: { reputation: 'desc' } } });
    return users.map(mapProfile);
  } catch {
    return [...communityProfiles].sort((a, b) => b.reputation - a.reputation);
  }
}

export async function searchCommunity(query: string) {
  const posts = await getCommunityFeed({ query, take: 20 });
  return { posts };
}

function filterSeedPosts(options: FeedOptions): CommunityPost[] {
  const q = options.query?.toLowerCase();
  let posts = [...communityPosts];
  if (options.category) posts = posts.filter((post) => post.category === options.category);
  if (options.tag) posts = posts.filter((post) => post.tags.map((tag) => tag.toLowerCase().replace(/\s+/g, '-')).includes(options.tag!));
  if (options.sort === 'unresolved') posts = posts.filter((post) => post.status === 'OPEN' || post.status === 'INVESTIGATING');
  if (options.sort === 'solved') posts = posts.filter((post) => post.status === 'SOLVED');
  if (options.sort === 'critical') posts = posts.filter((post) => post.severity === 'CRITICAL');
  if (q) {
    posts = posts.filter((post) => `${post.title} ${post.body} ${post.tags.join(' ')} ${post.affectedProduct ?? ''}`.toLowerCase().includes(q));
  }
  if (options.sort === 'trending') posts.sort((a, b) => b.voteCount + b.commentCount * 3 - (a.voteCount + a.commentCount * 3));
  else if (options.sort === 'most-discussed') posts.sort((a, b) => b.commentCount - a.commentCount);
  else posts.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return posts.slice(0, options.take ?? 20);
}

function orderByFor(sort?: FeedSort) {
  if (sort === 'trending') return [{ votes: { _count: 'desc' } }, { comments: { _count: 'desc' } }, { createdAt: 'desc' }];
  if (sort === 'most-discussed') return [{ comments: { _count: 'desc' } }, { createdAt: 'desc' }];
  if (sort === 'critical') return [{ createdAt: 'desc' }];
  return [{ createdAt: 'desc' }];
}

function mapProfile(user: any): CommunityProfile {
  return {
    id: user.id,
    username: user.username,
    displayName: user.profile?.displayName ?? user.username,
    title: user.profile?.title ?? 'IT Professional',
    company: user.profile?.company ?? undefined,
    skills: user.profile?.skills ?? [],
    role: user.role,
    reputation: user.profile?.reputation ?? 0,
    acceptedAnswersCount: user.profile?.acceptedAnswersCount ?? 0,
    postsCount: user.profile?.postsCount ?? 0,
  };
}

function mapPost(post: any): CommunityPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    body: post.body,
    type: post.type,
    category: post.category,
    tags: post.tags?.map((item: any) => item.tag.name) ?? [],
    affectedVendor: post.affectedVendor ?? undefined,
    affectedProduct: post.affectedProduct ?? undefined,
    environment: (post.environment as Record<string, string>) ?? {},
    severity: post.severity,
    status: post.status,
    author: mapProfile(post.author),
    voteCount: post.votes?.reduce((sum: number, vote: any) => sum + vote.value, 0) ?? 0,
    commentCount: post.comments?.length ?? 0,
    acceptedSolution: post.acceptedComment ? mapComment({ ...post.acceptedComment, replies: [] }) : undefined,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

function mapComment(comment: any): CommunityComment {
  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId ?? undefined,
    body: comment.body,
    author: mapProfile(comment.author),
    voteCount: comment.votes?.reduce((sum: number, vote: any) => sum + vote.value, 0) ?? 0,
    isAccepted: comment.isAccepted,
    isModeratorNote: comment.isModeratorNote,
    createdAt: comment.createdAt.toISOString(),
    replies: comment.replies?.map(mapComment) ?? [],
  };
}
