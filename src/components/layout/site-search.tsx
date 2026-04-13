'use client';

import { FormEvent, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function SiteSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();

    if (!nextQuery) {
      router.push('/search');
      return;
    }

    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        minWidth: 'min(100%, 20rem)',
        flex: pathname === '/' ? '0 1 23rem' : '0 1 20rem',
      }}
    >
      <input
        aria-label="Search the website"
        className="input"
        placeholder="Search alerts, outages, or updates..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={{
          minWidth: 0,
          padding: '0.75rem 0.95rem',
          borderColor: 'rgba(0, 240, 255, 0.22)',
          background: 'rgba(11, 17, 30, 0.86)',
          color: '#dce8ff',
          boxShadow: 'inset 0 0 24px rgba(0, 240, 255, 0.04)',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '0.78rem 0.95rem',
          borderRadius: '10px',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.18), rgba(77, 163, 255, 0.16))',
          color: '#dff7ff',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </form>
  );
}
