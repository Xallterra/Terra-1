import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getServerSessionMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
}));

vi.mock('next-auth', () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

describe('auth guards', () => {
  beforeEach(() => {
    getServerSessionMock.mockReset();
  });

  it('rejects unauthenticated users', async () => {
    getServerSessionMock.mockResolvedValue(null);
    const { requireUser } = await import('./auth');
    await expect(requireUser()).rejects.toThrow('You must be logged in');
  });

  it('rejects suspended users', async () => {
    getServerSessionMock.mockResolvedValue({
      user: {
        id: 'u1',
        email: 'admin@example.com',
        username: 'admin',
        role: 'USER',
        status: 'SUSPENDED',
      },
    });
    const { requireUser } = await import('./auth');
    await expect(requireUser()).rejects.toThrow('cannot perform this action');
  });

  it('returns active users', async () => {
    getServerSessionMock.mockResolvedValue({
      user: {
        id: 'u1',
        email: 'admin@example.com',
        name: 'Admin',
        username: 'admin',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    const { requireUser } = await import('./auth');
    await expect(requireUser()).resolves.toMatchObject({ id: 'u1', role: 'ADMIN' });
  });
});
