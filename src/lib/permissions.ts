import type { CommunityRole } from '@/types/community';

export type PermissionUser = {
  id: string;
  role: CommunityRole;
  status?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
};

export function isActiveUser(user: PermissionUser | null | undefined): user is PermissionUser {
  return Boolean(user && (!user.status || user.status === 'ACTIVE'));
}

export function isModerator(user: PermissionUser | null | undefined): boolean {
  return isActiveUser(user) && (user.role === 'MODERATOR' || user.role === 'ADMIN');
}

export function isAdmin(user: PermissionUser | null | undefined): boolean {
  return isActiveUser(user) && user.role === 'ADMIN';
}

export function canCreateContent(user: PermissionUser | null | undefined): boolean {
  return isActiveUser(user);
}

export function canUseChat(user: PermissionUser | null | undefined): boolean {
  return isActiveUser(user);
}

export function canAcceptSolution(user: PermissionUser | null | undefined, postAuthorId: string): boolean {
  return isActiveUser(user) && (user.id === postAuthorId || isModerator(user));
}
