'use client';

import { FormEvent, useState } from 'react';

type State = { type: 'idle' | 'success' | 'error'; message?: string };

export function SubscribeForm() {
  const [state, setState] = useState<State>({ type: 'idle' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setState({ type: 'idle' });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setState({ type: 'error', message: result.error ?? 'Subscription failed.' });
      setLoading(false);
      return;
    }

    form.reset();
    setState({ type: 'success', message: 'Subscribed. You will receive Makriva updates.' });
    setLoading(false);
  }

  return (
    <form style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }} onSubmit={onSubmit}>
      <input className="input" style={{ maxWidth: 360 }} placeholder="Work email" type="email" name="email" required />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Submitting...' : 'Subscribe'}
      </button>
      {state.type !== 'idle' && (
        <p style={{ margin: 0, width: '100%', color: state.type === 'success' ? '#7ff0b2' : '#ff9aa4' }}>{state.message}</p>
      )}
    </form>
  );
}
