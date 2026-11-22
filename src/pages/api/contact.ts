import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { config, siteUrl } from '../../config';
import { confirmationEmail, notificationEmail } from '../../lib/emails';

// The one server route on the site: the contact form posts here and the brief lands in
// your inbox (config.email, or CONTACT_TO) through Resend. Everything else stays static.
export const prerender = false;

// RESEND_API_KEY comes from the Resend integration on Vercel. CONTACT_FROM must be an address
// on a domain verified in Resend (e.g. "Avery Lane <hello@example.com>"); until
// then Resend's test sender is used, which can only deliver to the Resend account's own email.
// The visitor gets a confirmation email only once CONTACT_FROM is set.
const FALLBACK_FROM = 'Website enquiry <onboarding@resend.dev>';

const LIMITS = { name: 120, email: 200, company: 160, type: 80, budget: 40, timeline: 40, details: 5000 };
type Field = keyof typeof LIMITS;

// Best effort per warm instance: at most 5 briefs per IP in 10 minutes.
const recent = new Map<string, number[]>();
const rateLimited = (ip: string) => {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
};

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Bots fill the hidden field or submit faster than a person can type.
  const startedAt = Number(data.get('started') ?? 0);
  if (String(data.get('website') ?? '') !== '' || (startedAt && Date.now() - startedAt < 3000)) {
    return json({ ok: true });
  }

  const get = (k: Field) => String(data.get(k) ?? '').trim().slice(0, LIMITS[k]);
  const brief = Object.fromEntries((Object.keys(LIMITS) as Field[]).map((k) => [k, get(k)])) as Record<Field, string>;
  if (!brief.name || !brief.details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  if (rateLimited(clientAddress ?? 'unknown')) return json({ ok: false, error: 'rate' }, 429);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ ok: false, error: 'unavailable' }, 503);
  const resend = new Resend(key);
  const from = process.env.CONTACT_FROM || FALLBACK_FROM;
  const to = process.env.CONTACT_TO || config.email;

  const rows: [string, string][] = [
    ['Name', brief.name],
    ['Email', brief.email],
    ['Company', brief.company],
    ['Project type', brief.type],
    ['Budget', brief.budget],
    ['Timeline', brief.timeline],
  ].filter(([, v]) => v) as [string, string][];

  const subject = `New project enquiry: ${brief.name}${brief.type ? ` — ${brief.type}` : ''}`;
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', brief.details].join('\n');
  const html = notificationEmail(brief);

  const sent = await resend.emails.send({ from, to, replyTo: brief.email, subject, text, html });
  if (sent.error) {
    console.error('Contact form: Resend error', sent.error);
    return json({ ok: false, error: 'send' }, 502);
  }

  if (process.env.CONTACT_FROM) {
    const first = brief.name.split(/\s+/)[0];
    await resend.emails
      .send({
        from,
        to: brief.email,
        replyTo: process.env.CONTACT_TO || config.email,
        subject: `Thanks, ${first} — your project brief is in`,
        text: `Hi ${first},\n\nThanks for telling me about your project. I read every brief myself and will reply within ${config.responseTime}.${config.whatsapp ? ` If it is urgent, message me on WhatsApp: https://wa.me/${config.whatsapp.number}` : ''}\n\nYour brief:\n\n${text}\n\n— ${config.name}\n${config.role} · ${siteUrl}`,
        html: confirmationEmail(brief),
      })
      .catch((err) => console.error('Contact form: confirmation failed', err));
  }

  return json({ ok: true });
};
