import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/server/rate-limit';
import { sendWithResend } from '@/lib/server/resend';
import { escapeHtml } from '@/lib/server/sanitize';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(`subscribe:${ip}`, 15, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many subscribe attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const email = String(body.email ?? '').trim();
    const honey = String(body.website ?? '').trim();

    if (honey) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY.' }, { status: 503 });
    }

    const to = process.env.CONTACT_TO_EMAIL ?? 'makriva14@gmail.com';
    const from = process.env.CONTACT_FROM_EMAIL ?? 'Makriva <onboarding@resend.dev>';

    const safeEmail = escapeHtml(email);

    await sendWithResend({
      to,
      from,
      subject: '[Makriva Subscribe] New subscription request',
      html: `<p><strong>Subscriber:</strong> ${safeEmail}</p>`
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to subscribe.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
