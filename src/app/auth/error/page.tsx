import Link from 'next/link';

const messages: Record<string, string> = {
  AccountDisabled: 'This account cannot perform actions right now. Contact an administrator if this seems wrong.',
  PasswordResetUnavailable: 'Password reset is not enabled yet. Contact your Makriva administrator for help.',
  AccessDenied: 'You do not have permission to access that page.',
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const message = messages[params.error ?? ''] ?? 'Authentication could not be completed.';

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="mk-kicker">Authentication</p>
        <h1>Something needs attention</h1>
        <p>{message}</p>
        <div className="auth-links">
          <Link href="/login">Log in</Link>
          <Link href="/">Return to feed</Link>
        </div>
      </section>
    </main>
  );
}
