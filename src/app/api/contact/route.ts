import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/server/rate-limit';
import { sendWithResend } from '@/lib/server/resend';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    if (isRateLimited(`contact:${ip}`, 8, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const subject = String(body.subject ?? '').trim();
    const message = String(body.message ?? '').trim();
    const honey = String(body.website ?? '').trim();

    if (honey) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY.' }, { status: 503 });
    }

    if (!process.env.CONTACT_FROM_EMAIL) {
      return NextResponse.json(
        { error: 'Missing CONTACT_FROM_EMAIL. Use a verified Resend sender/domain.' },
        { status: 503 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL ?? 'makriva14@gmail.com';
    const from = process.env.CONTACT_FROM_EMAIL;

    await sendWithResend({
      to,
      from,
      subject: `[Makriva Contact] ${subject}`,
      html: `
        <h2>Makriva Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit message.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
