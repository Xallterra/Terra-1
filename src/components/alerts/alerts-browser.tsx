'use client';

import { useMemo, useState } from 'react';
import { AlertItem } from '@/types/alert';
import { AlertCard } from './alert-card';
import { AlertFilters } from './alert-filters';
import { EmptyState } from '../shared/empty-state';

export function AlertsBrowser({ items }: { items: AlertItem[] }) {
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((item) => {
      const categoryMatch = category === 'All' || item.category === category;
      const searchable = `${item.title} ${item.summary} ${item.subcategory} ${item.tags.join(' ')}`.toLowerCase();
      const searchMatch = !q || searchable.includes(q);
      return categoryMatch && searchMatch;
    });
  }, [items, category, search]);

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
          title="No alerts match your current filter"
          description="Try a different category or keyword. Makriva continuously updates new intelligence as incidents evolve."
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
