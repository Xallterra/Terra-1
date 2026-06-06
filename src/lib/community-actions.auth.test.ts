import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireUserMock } = vi.hoisted(() => ({
  requireUserMock: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  requireUser: requireUserMock,
  canModerate: vi.fn(() => false),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('community mutation auth guards', () => {
  beforeEach(() => {
    requireUserMock.mockReset();
    requireUserMock.mockRejectedValue(new Error('You must be logged in to do that.'));
  });

  it('rejects unauthenticated post creation', async () => {
    const { createPostAction } = await import('./community-actions');
    await expect(createPostAction(new FormData())).rejects.toThrow('logged in');
  });

  it('rejects unauthenticated comments', async () => {
    const { createCommentAction } = await import('./community-actions');
    await expect(createCommentAction(new FormData())).rejects.toThrow('logged in');
  });
});
