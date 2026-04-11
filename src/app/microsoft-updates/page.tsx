import { alerts } from '@/lib/alerts-data';
import { PageHero } from '@/components/shared/page-hero';
import { AlertCard } from '@/components/alerts/alert-card';
import { EmptyState } from '@/components/shared/empty-state';

export default function MicrosoftUpdatesPage() {
  const items = alerts.filter((item) => item.category === 'Microsoft Update' || item.subcategory.match(/Windows|Intune|Azure|Defender|Microsoft 365/i));
  return (
    <>
      <PageHero title="Microsoft Updates" subtitle="Windows, Intune, Azure, Defender, and Microsoft 365 updates relevant to enterprise operations." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        {items.length === 0 ? (
          <EmptyState title="No Microsoft updates right now" description="New Microsoft update intelligence will appear here as soon as it is published." />
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {items.map((item) => (
              <AlertCard key={item.id} alert={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
