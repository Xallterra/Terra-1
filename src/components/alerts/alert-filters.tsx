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
    <section className="card alert-filters" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
      <style>{`
        .alert-filters__categories {
          display: flex;
          gap: 0.55rem;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .alert-filters__categories {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.2rem;
          }
          .alert-filters__categories button {
            flex: 0 0 auto;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="alert-filters__categories">
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
        style={{ minWidth: 0 }}
      />
    </section>
  );
}
