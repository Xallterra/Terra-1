export async function sendWithResend(params: {
  to: string;
  from: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${response.status} ${text}`);
  }

  return { skipped: false };
}
