import type { CommunityRole } from '@/types/community';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: CommunityRole;
};

export async function getCurrentUser(): Promise<AuthUser> {
  return {
    id: process.env.MAKRIVA_DEMO_USER_ID ?? 'demo-user',
    email: process.env.MAKRIVA_DEMO_USER_EMAIL ?? 'demo@makriva.local',
    username: process.env.MAKRIVA_DEMO_USERNAME ?? 'demo-admin',
    role: (process.env.MAKRIVA_DEMO_ROLE as CommunityRole | undefined) ?? 'ADMIN',
  };
}

export function canModerate(role: CommunityRole): boolean {
  return role === 'MODERATOR' || role === 'ADMIN';
}
