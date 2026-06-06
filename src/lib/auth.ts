import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import type { CommunityRole } from '@/types/community';
import { isModerator } from '@/lib/permissions';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  username: string;
  role: CommunityRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    if (typeof error === 'object' && error && 'digest' in error && error.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Session lookup failed:', error);
    return null;
  }

  if (!session?.user?.email) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    username: session.user.username,
    role: session.user.role as CommunityRole,
    status: session.user.status as AuthUser['status'],
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in to do that.');
  if (user.status !== 'ACTIVE') throw new Error('Your account cannot perform this action.');
  return user;
}

export async function requireUserPage(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.status !== 'ACTIVE') redirect('/auth/error?error=AccountDisabled');
  return user;
}

export async function requireModerator(): Promise<AuthUser> {
  const user = await requireUser();
  if (!isModerator(user)) throw new Error('Moderator permissions are required.');
  return user;
}

export function canModerate(role: CommunityRole): boolean {
  return role === 'MODERATOR' || role === 'ADMIN';
}
