'use client';

import { FormEvent, useState } from 'react';

type State = { type: 'idle' | 'success' | 'error'; message?: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ type: 'idle' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setState({ type: 'idle' });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setState({ type: 'error', message: result.error ?? 'Submission failed.' });
      setLoading(false);
      return;
    }

    form.reset();
    setState({ type: 'success', message: 'Your message has been sent.' });
    setLoading(false);
  }

  return (
    <form style={{ display: 'grid', gap: '0.8rem', maxWidth: 680 }} onSubmit={onSubmit}>
      <input className="input" placeholder="Name" name="name" required />
      <input className="input" placeholder="Email" type="email" name="email" required />
      <input className="input" placeholder="Subject" name="subject" required />
      <textarea className="input" placeholder="Message" name="message" rows={6} required />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
      {state.type !== 'idle' && (
        <p style={{ margin: 0, color: state.type === 'success' ? '#7ff0b2' : '#ff9aa4' }}>{state.message}</p>
      )}
    </form>
  );
}
