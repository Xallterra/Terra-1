'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signupAction } from '@/lib/account-actions';

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, {});

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--wide">
        <p className="mk-kicker">Create workspace identity</p>
        <h1>Create your Makriva account</h1>
        <p>Join the shared admin knowledge workspace for incidents, fixes, playbooks, and alerts.</p>
        {state.message && <div className="form-message error">{state.message}</div>}
        <form className="auth-form" action={formAction}>
          <div className="form-grid-2">
            <label>
              Name
              <input name="name" autoComplete="name" required />
              {state.fieldErrors?.name && <small>{state.fieldErrors.name[0]}</small>}
            </label>
            <label>
              Username
              <input name="username" autoComplete="username" placeholder="endpoint_admin" required />
              {state.fieldErrors?.username && <small>{state.fieldErrors.username[0]}</small>}
            </label>
          </div>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
            {state.fieldErrors?.email && <small>{state.fieldErrors.email[0]}</small>}
          </label>
          <div className="form-grid-2">
            <label>
              Password
              <input name="password" type="password" autoComplete="new-password" required />
              {state.fieldErrors?.password && <small>{state.fieldErrors.password[0]}</small>}
            </label>
            <label>
              Confirm password
              <input name="confirmPassword" type="password" autoComplete="new-password" required />
              {state.fieldErrors?.confirmPassword && <small>{state.fieldErrors.confirmPassword[0]}</small>}
            </label>
          </div>
          <div className="form-grid-2">
            <label>
              Role or title
              <input name="title" placeholder="Endpoint Engineer" />
            </label>
            <label>
              Company
              <input name="company" placeholder="Contoso IT" />
            </label>
          </div>
          <label className="checkbox-row">
            <input name="terms" type="checkbox" required />
            <span>I agree to use Makriva for professional admin knowledge sharing.</span>
          </label>
          {state.fieldErrors?.terms && <small>{state.fieldErrors.terms[0]}</small>}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="auth-links">
          <Link href="/login">Already have an account?</Link>
        </div>
      </section>
    </main>
  );
}
