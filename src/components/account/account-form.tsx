'use client';

import { useActionState } from 'react';
import { updateAccountAction } from '@/lib/account-actions';

type AccountFormProps = {
  account: {
    email: string;
    displayName: string;
    username: string;
    title?: string | null;
    company?: string | null;
    bio?: string | null;
    website?: string | null;
    avatarUrl?: string | null;
  };
};

export function AccountForm({ account }: AccountFormProps) {
  const [state, formAction, pending] = useActionState(updateAccountAction, {});

  return (
    <form className="auth-form" action={formAction}>
      {state.message && <div className={`form-message ${state.ok ? 'success' : 'error'}`}>{state.message}</div>}
      <label>
        Email
        <input value={account.email} readOnly />
      </label>
      <div className="form-grid-2">
        <label>
          Display name
          <input name="displayName" defaultValue={account.displayName} required />
          {state.fieldErrors?.displayName && <small>{state.fieldErrors.displayName[0]}</small>}
        </label>
        <label>
          Username
          <input name="username" defaultValue={account.username} required />
          {state.fieldErrors?.username && <small>{state.fieldErrors.username[0]}</small>}
        </label>
      </div>
      <div className="form-grid-2">
        <label>
          Title
          <input name="title" defaultValue={account.title ?? ''} />
        </label>
        <label>
          Company
          <input name="company" defaultValue={account.company ?? ''} />
        </label>
      </div>
      <label>
        Bio
        <textarea name="bio" defaultValue={account.bio ?? ''} rows={4} />
        {state.fieldErrors?.bio && <small>{state.fieldErrors.bio[0]}</small>}
      </label>
      <div className="form-grid-2">
        <label>
          Website
          <input name="website" type="url" defaultValue={account.website ?? ''} />
          {state.fieldErrors?.website && <small>{state.fieldErrors.website[0]}</small>}
        </label>
        <label>
          Avatar URL
          <input name="avatarUrl" type="url" defaultValue={account.avatarUrl ?? ''} />
          {state.fieldErrors?.avatarUrl && <small>{state.fieldErrors.avatarUrl[0]}</small>}
        </label>
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save account'}
      </button>
    </form>
  );
}
