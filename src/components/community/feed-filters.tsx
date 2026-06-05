import Link from 'next/link';
import type { FeedSort } from '@/types/community';
import { postCategories } from '@/lib/community-validation';

const sorts: { value: FeedSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
  { value: 'most-discussed', label: 'Most discussed' },
  { value: 'unresolved', label: 'Unresolved' },
  { value: 'solved', label: 'Solved' },
  { value: 'critical', label: 'Critical' },
];

export function FeedFilters({ category, sort }: { category?: string; sort?: FeedSort }) {
  return (
    <section className="mk-feed-filters">
      <div className="mk-filter-row">
        {sorts.map((item) => (
          <Link className={`mk-pill ${sort === item.value || (!sort && item.value === 'newest') ? 'active' : ''}`} href={`/?sort=${item.value}${category ? `&category=${category}` : ''}`} key={item.value}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mk-filter-row">
        <Link className={`mk-pill ${!category ? 'active' : ''}`} href="/">
          All
        </Link>
        {postCategories.map((item) => (
          <Link className={`mk-pill ${category === item ? 'active' : ''}`} href={`/?category=${encodeURIComponent(item)}${sort ? `&sort=${sort}` : ''}`} key={item}>
            {item}
          </Link>
        ))}
      </div>
    </section>
  );
}
