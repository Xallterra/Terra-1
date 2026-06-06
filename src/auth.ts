import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Adapter, AdapterUser } from 'next-auth/adapters';
import { loginSchema } from '@/lib/auth-validation';
import { verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

type SafeAuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  username: string;
  role: string;
  status: string;
};

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Email and password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const limited = await rateLimit(`login:${parsed.data.email}`, 8, 60);
      if (!limited.allowed) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          username: true,
          passwordHash: true,
          role: true,
          status: true,
        },
      });

      if (!user?.passwordHash || user.status !== 'ACTIVE') return null;
      const valid = await verifyPassword(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        username: user.username,
        role: user.role,
        status: user.status,
      } satisfies SafeAuthUser;
    },
  }),
];

function usernameBase(input: string): string {
  const normalized = input
    .toLowerCase()
    .replace(/@.*$/, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24);
  return normalized.length >= 3 ? normalized : `admin-${normalized || 'user'}`;
}

async function uniqueUsername(seed: string): Promise<string> {
  const base = usernameBase(seed);
  let candidate = base;
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })) {
    candidate = `${base.slice(0, 24)}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

const prismaAdapter = PrismaAdapter(prisma) as Adapter;
const baseCreateUser = prismaAdapter.createUser?.bind(prismaAdapter);

prismaAdapter.createUser = async (user: Omit<AdapterUser, 'id'>) => {
  const username = await uniqueUsername(user.email ?? user.name ?? 'admin');
  if (!baseCreateUser) throw new Error('Prisma adapter createUser is unavailable.');
  const created = await baseCreateUser({ ...user, username, role: 'USER', status: 'ACTIVE' } as Omit<AdapterUser, 'id'>);

  await prisma.profile.upsert({
    where: { userId: created.id },
    create: { userId: created.id, displayName: user.name ?? username },
    update: {},
  });

  return created;
};

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: prismaAdapter,
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  providers,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const dbUser = await prisma.user.findUnique({ where: { email: user.email }, select: { status: true } });
      if (!dbUser) return true;
      return dbUser?.status !== 'SUSPENDED' && dbUser?.status !== 'DELETED';
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.status = user.status;
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, username: true, role: true, status: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.username = String(token.username);
        session.user.role = String(token.role);
        session.user.status = String(token.status);
      }
      return session;
    },
  },
};
