import { describe, expect, it } from 'vitest';
import { canAcceptSolution, canCreateContent, canUseChat, isAdmin, isModerator } from './permissions';

const activeUser = { id: 'u1', role: 'USER' as const, status: 'ACTIVE' as const };
const suspendedAdmin = { id: 'u2', role: 'ADMIN' as const, status: 'SUSPENDED' as const };
const moderator = { id: 'u3', role: 'MODERATOR' as const, status: 'ACTIVE' as const };

describe('permissions', () => {
  it('allows active users to create content and chat', () => {
    expect(canCreateContent(activeUser)).toBe(true);
    expect(canUseChat(activeUser)).toBe(true);
  });

  it('blocks suspended users from privileged actions', () => {
    expect(canCreateContent(suspendedAdmin)).toBe(false);
    expect(canUseChat(suspendedAdmin)).toBe(false);
    expect(isAdmin(suspendedAdmin)).toBe(false);
  });

  it('recognizes moderators', () => {
    expect(isModerator(moderator)).toBe(true);
  });

  it('allows post owners or moderators to accept solutions', () => {
    expect(canAcceptSolution(activeUser, 'u1')).toBe(true);
    expect(canAcceptSolution(activeUser, 'someone-else')).toBe(false);
    expect(canAcceptSolution(moderator, 'someone-else')).toBe(true);
  });
});
