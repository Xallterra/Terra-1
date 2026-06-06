'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

function errorMessage(code: string | null): string | null {
  if (!code) return null;
  if (code === 'CredentialsSignin') return 'Email or password is incorrect.';
  return 'We could not sign you in. Please try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(errorMessage(searchParams.get('error')));
  const [loading, setLoading] = useState(false);
  const created = searchParams.get('created') === '1';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
      callbackUrl: '/',
    });
    setLoading(false);

    if (result?.ok) {
      router.push('/');
      router.refresh();
      return;
    }
    setError('Email or password is incorrect.');
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="mk-kicker">Welcome back</p>
        <h1>Log in to Makriva</h1>
        <p>Use your admin account to post, comment, vote, bookmark, and use chat.</p>
        {created && <div className="form-message success">Account created. Log in to continue.</div>}
        {error && <div className="form-message error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <div className="auth-links">
          <Link href="/signup">Create account</Link>
          <Link href="/auth/error?error=PasswordResetUnavailable">Forgot password?</Link>
        </div>
      </section>
    </main>
  );
}
