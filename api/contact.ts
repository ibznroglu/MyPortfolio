import { Resend } from 'resend';
import { contactSchema, toFieldErrors } from '../src/lib/contactSchema.js';

// Serverless instances are short-lived and there can be several at once, so
// this throttles bursts rather than guaranteeing a global limit. Good enough to
// stop a naive script; anything more needs durable storage.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const attempts = new Map<string, number[]>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(ip, recent);
    return true;
  }

  recent.push(now);
  attempts.set(ip, recent);
  return false;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.error('Contact form is missing RESEND_API_KEY or CONTACT_TO_EMAIL');
    return json({ error: 'serverMisconfigured' }, 500);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return json({ error: 'rateLimited' }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalidBody' }, 400);
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return json({ error: 'validationFailed', fields: toFieldErrors(parsed.error) }, 400);
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot tripped: answer as if everything went fine so the bot learns nothing.
  if (company) {
    return json({ ok: true }, 200);
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <contact@isabezeniroglu.com>',
      to: [to],
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
    });

    if (error) {
      console.error('Resend rejected the message:', error);
      return json({ error: 'sendFailed' }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error('Unexpected failure while sending contact mail:', error);
    return json({ error: 'sendFailed' }, 500);
  }
}
