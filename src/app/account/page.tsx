import { AccountForm } from '@/components/account/account-form';
import { requireUserPage } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AccountPage() {
  const user = await requireUserPage();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  if (!dbUser) return null;

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--wide">
        <p className="mk-kicker">Account settings</p>
        <h1>Your admin identity</h1>
        <p>Keep your profile accurate so other admins understand your context and expertise.</p>
        <AccountForm
          account={{
            email: dbUser.email,
            displayName: dbUser.profile?.displayName ?? dbUser.name ?? dbUser.username,
            username: dbUser.username,
            title: dbUser.profile?.title,
            company: dbUser.profile?.company,
            bio: dbUser.profile?.bio,
            website: dbUser.profile?.website,
            avatarUrl: dbUser.profile?.avatarUrl ?? dbUser.image,
          }}
        />
      </section>
    </main>
  );
}
