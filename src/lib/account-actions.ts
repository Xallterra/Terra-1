'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { signupSchema, updateProfileSchema } from '@/lib/auth-validation';
import { requireUser } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { hasDatabaseUrl, prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export type ActionState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === 'string' ? entry : '';
}

export async function signupAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasDatabaseUrl()) {
    return { message: 'Account creation requires DATABASE_URL to be configured.' };
  }

  const parsed = signupSchema.safeParse({
    name: value(formData, 'name'),
    username: value(formData, 'username'),
    email: value(formData, 'email'),
    password: value(formData, 'password'),
    confirmPassword: value(formData, 'confirmPassword'),
    title: value(formData, 'title'),
    company: value(formData, 'company'),
    terms: value(formData, 'terms'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, message: 'Fix the highlighted fields.' };
  }

  const limited = await rateLimit(`signup:${parsed.data.email}`, 4, 300);
  if (!limited.allowed) return { message: 'Too many signup attempts. Please try again later.' };

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: parsed.data.email }, { username: parsed.data.username }] },
    select: { email: true, username: true },
  });

  if (existing?.email === parsed.data.email) return { message: 'That email or username is already in use.' };
  if (existing?.username === parsed.data.username) return { message: 'That email or username is already in use.' };

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      username: parsed.data.username,
      email: parsed.data.email,
      passwordHash,
      profile: {
        create: {
          displayName: parsed.data.name,
          title: parsed.data.title || null,
          company: parsed.data.company || null,
        },
      },
    },
  });

  redirect('/login?created=1');
}

export async function updateAccountAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse({
    displayName: value(formData, 'displayName'),
    username: value(formData, 'username'),
    title: value(formData, 'title'),
    company: value(formData, 'company'),
    bio: value(formData, 'bio'),
    website: value(formData, 'website'),
    avatarUrl: value(formData, 'avatarUrl'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, message: 'Fix the highlighted fields.' };
  }

  const usernameOwner = await prisma.user.findUnique({ where: { username: parsed.data.username }, select: { id: true } });
  if (usernameOwner && usernameOwner.id !== user.id) return { message: 'That username is already taken.' };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username: parsed.data.username,
      name: parsed.data.displayName,
      image: parsed.data.avatarUrl || null,
      profile: {
        upsert: {
          create: {
            displayName: parsed.data.displayName,
            title: parsed.data.title || null,
            company: parsed.data.company || null,
            bio: parsed.data.bio || null,
            website: parsed.data.website || null,
            avatarUrl: parsed.data.avatarUrl || null,
          },
          update: {
            displayName: parsed.data.displayName,
            title: parsed.data.title || null,
            company: parsed.data.company || null,
            bio: parsed.data.bio || null,
            website: parsed.data.website || null,
            avatarUrl: parsed.data.avatarUrl || null,
          },
        },
      },
    },
  });

  revalidatePath('/account');
  revalidatePath(`/profile/${parsed.data.username}`);
  return { ok: true, message: 'Account updated.' };
}
