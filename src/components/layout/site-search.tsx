'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SiteSearch() {
  const router = useRouter();
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
    <form className="site-search" onSubmit={handleSubmit}>
      <input
        aria-label="Search the website"
        placeholder="Search Makriva"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
