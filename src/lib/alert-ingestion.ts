/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchAlerts } from '@/lib/alerts-data';
import { hasDatabaseUrl, prisma } from '@/lib/prisma';

const severityMap = {
  Critical: 'CRITICAL',
  High: 'HIGH',
  Medium: 'MEDIUM',
  Low: 'LOW',
} as const;

export async function ingestAlertsToDatabase() {
  const alerts = await fetchAlerts();
  if (!hasDatabaseUrl()) {
    return { persisted: false, itemsFound: alerts.length, itemsUpserted: 0 };
  }

  const db = prisma as any;
  let itemsUpserted = 0;
  for (const alert of alerts) {
    await db.alert.upsert({
      where: { slug: alert.slug },
      create: {
        externalId: alert.id,
        slug: alert.slug,
        title: alert.title,
        category: alert.category,
        subcategory: alert.subcategory,
        severity: alert.severity ? severityMap[alert.severity] : undefined,
        summary: alert.summary,
        impact: alert.impact,
        recommendedAction: alert.recommended_action,
        sourceName: alert.source_name,
        sourceUrl: alert.source_url,
        status: alert.status,
        tags: alert.tags,
        publishedAt: new Date(alert.published_at),
      },
      update: {
        title: alert.title,
        category: alert.category,
        subcategory: alert.subcategory,
        severity: alert.severity ? severityMap[alert.severity] : undefined,
        summary: alert.summary,
        impact: alert.impact,
        recommendedAction: alert.recommended_action,
        sourceName: alert.source_name,
        sourceUrl: alert.source_url,
        status: alert.status,
        tags: alert.tags,
        publishedAt: new Date(alert.published_at),
      },
    });
    itemsUpserted += 1;
  }

  return { persisted: true, itemsFound: alerts.length, itemsUpserted };
}
