import { Resend } from 'resend';
import { contactSchema, toFieldErrors } from '../src/lib/contactSchema.js';

// Serverless instances are short-lived and there can be several at once, so
// this throttles bursts rather than guaranteeing a global limit. Good enough to
// stop a naive script; anything more needs durable storage.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MAX_BODY_BYTES = 8_000;

// Only requests that came from a page we served are accepted. A determined
// attacker can forge this header, so it is a filter against scripted floods,
// not an authentication mechanism.
const allowedOrigins = (): string[] => {
  const origins = ['https://isabezeniroglu.com', 'https://www.isabezeniroglu.com'];
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) origins.push(`https://${process.env.VERCEL_BRANCH_URL}`);
  return origins;
};
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
/**
 * Cloudflare verifies that the token came from a real browser session on one of
 * our hostnames. Tokens are single use, so a replayed one is rejected here.
 */
const isHumanVerified = async (token: string | undefined, ip: string): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Not configured (local development): fall back to the other guards.
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });

    const result = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };

    if (!result.success) {
      console.warn('Turnstile rejected a submission:', result['error-codes']);
    }

    return result.success === true;
  } catch (error) {
    console.error('Could not reach Turnstile:', error);
    return false;
  }
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
  const origin = request.headers.get('origin');

  if (!origin || !allowedOrigins().includes(origin)) {
    return json({ error: 'forbidden' }, 403);
  }

  if (request.headers.get('content-type')?.includes('application/json') !== true) {
    return json({ error: 'invalidBody' }, 415);
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);

  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'invalidBody' }, 413);
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
  const token =
    typeof payload === 'object' && payload !== null && 'turnstileToken' in payload
      ? String((payload as { turnstileToken: unknown }).turnstileToken)
      : undefined;

  if (!(await isHumanVerified(token, ip))) {
    return json({ error: 'humanCheckFailed' }, 403);
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
