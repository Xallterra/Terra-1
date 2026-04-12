'use client';

import { AlertCategory } from '@/types/alert';

type FilterProps = {
  categories: AlertCategory[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function AlertFilters({ categories, activeCategory, onCategoryChange, search, onSearchChange }: FilterProps) {
  return (
    <section className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeCategory === 'All' ? '' : 'secondary'}`} onClick={() => onCategoryChange('All')}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`btn ${activeCategory === category ? '' : 'secondary'}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <input
        className="input"
        placeholder="Search by title, summary, tag, product, or keyword..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </section>
  );
}
