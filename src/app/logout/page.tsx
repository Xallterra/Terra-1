'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ callbackUrl: '/' });
  }, []);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="mk-kicker">Signing out</p>
        <h1>Ending your session...</h1>
        <p>You will be redirected to the public feed.</p>
      </section>
    </main>
  );
}
