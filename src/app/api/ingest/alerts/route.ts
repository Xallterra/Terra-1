import { NextResponse } from 'next/server';
import { ingestAlertsToDatabase } from '@/lib/alert-ingestion';

export async function POST(request: Request) {
  const configuredSecret = process.env.INGESTION_SECRET;
  if (configuredSecret) {
    const provided = request.headers.get('x-ingestion-secret');
    if (provided !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const result = await ingestAlertsToDatabase();
  return NextResponse.json(result);
}
