'use client';

import { useMemo, useState } from 'react';
import { AlertItem } from '@/types/alert';
import { AlertCard } from './alert-card';
import { AlertFilters } from './alert-filters';
import { EmptyState } from '../shared/empty-state';
import { getAlertSearchableText } from '@/lib/alert-text';

type AlertsBrowserProps = {
  items: AlertItem[];
  initialSearch?: string;
  requireSearchTerm?: boolean;
};

export function AlertsBrowser({ items, initialSearch = '', requireSearchTerm = false }: AlertsBrowserProps) {
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState(initialSearch);

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (requireSearchTerm && !q) return [];

    return items.filter((item) => {
      const categoryMatch = category === 'All' || item.category === category;
      const searchable = getAlertSearchableText(item);
      const searchMatch = !q || searchable.includes(q);
      return categoryMatch && searchMatch;
    });
  }, [items, category, search, requireSearchTerm]);

  const showSearchPrompt = requireSearchTerm && !search.trim();

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <AlertFilters
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />
      {filtered.length === 0 ? (
        <EmptyState
          title={showSearchPrompt ? 'Enter a search term to scan the intelligence feed' : 'No alerts match your current filter'}
          description={
            showSearchPrompt
              ? 'Search across alerts, outages, Microsoft updates, products, tags, and source names from one place.'
              : 'Try a different category or keyword. Makriva continuously updates new intelligence as incidents evolve.'
          }
        />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
