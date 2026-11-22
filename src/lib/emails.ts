// HTML emails sent by /api/contact. Table layout and inline styles only, so they hold up in
// Gmail, Apple Mail and Outlook; colours and type follow the site (ink, paper, signal red).
import { config, siteHost, siteUrl } from '../config';
import { hireProcess } from '../data/site';

export type Brief = {
  name: string;
  email: string;
  company: string;
  type: string;
  budget: string;
  timeline: string;
  details: string;
};

const SITE = siteUrl;
const HOST = siteHost;
const C = { ink: '#14171f', text: '#4a5160', muted: '#636a78', rule: '#e3e6ea', paper: '#f2f3f5', accent: '#c8174f' };
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const firstName = (name: string) => name.trim().split(/\s+/)[0];

/** Pill-shaped button; `dark` for the main action. */
const button = (href: string, label: string, dark = true) =>
  `<a href="${href}" style="display:inline-block;padding:13px 22px;border-radius:999px;font-family:${FONT};font-size:15px;font-weight:700;text-decoration:none;white-space:nowrap;${
    dark ? `background:${C.ink};color:#ffffff;border:1px solid ${C.ink}` : `background:#ffffff;color:${C.ink};border:1px solid #cfd3d9`
  }">${label}</a>`;

/** Small labelled values (type, budget, timeline) shown as chips. */
const chips = (items: [string, string][]) =>
  items
    .map(
      ([label, value]) =>
        `<td style="padding:0 8px 8px 0;display:inline-block"><div style="padding:10px 14px;border-radius:12px;background:${C.paper}"><div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.muted}">${label}</div><div style="margin-top:2px;font-size:15px;font-weight:700;color:${C.ink};white-space:nowrap">${escape(value)}</div></div></td>`,
    )
    .join('');

const message = (details: string) =>
  `<div style="padding:20px 22px;border-radius:16px;background:${C.paper};border-left:3px solid ${C.accent};font-size:15px;line-height:1.6;color:${C.ink};white-space:pre-wrap">${escape(details)}</div>`;

/** Shared frame: grey canvas, white card, brand row on top, small footer below. */
const layout = (preheader: string, body: string, footer: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(preheader)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}">
<tr><td align="center" style="padding:36px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
  <tr><td style="padding:0 6px 18px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;border-radius:10px;background:${C.ink};font-family:${FONT};font-size:19px;font-weight:700;line-height:40px;text-align:center"><a href="${SITE}" style="display:block;color:#ffffff;text-decoration:none">${escape(config.monogram)}</a></td>
      <td style="padding-left:12px;font-family:${FONT};line-height:1.25"><div style="font-size:16px;font-weight:700;color:${C.ink}">${escape(config.name)}</div><div style="font-size:13px;color:${C.muted}">${escape(config.role)}</div></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;border-radius:24px;padding:36px 34px;font-family:${FONT};color:${C.ink}">${body}</td></tr>
  <tr><td style="padding:22px 8px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};text-align:center">${footer}</td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

/** To you: everything needed to answer the brief at a glance. */
export function notificationEmail(b: Brief) {
  const first = firstName(b.name);
  const meta = ([['Project', b.type], ['Budget', b.budget], ['Timeline', b.timeline]] as [string, string][]).filter(([, v]) => v);
  const reply = `mailto:${encodeURIComponent(b.email)}?subject=${encodeURIComponent(`Re: your project brief${b.type ? ` (${b.type})` : ''}`)}`;
  const body = `
<div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#fdecef;color:${C.accent};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase">New project brief</div>
<h1 style="margin:16px 0 6px;font-size:28px;line-height:1.15;letter-spacing:-.02em">${escape(b.name)}${b.company ? `<span style="color:${C.muted};font-weight:500"> · ${escape(b.company)}</span>` : ''}</h1>
<p style="margin:0 0 24px;font-size:15px"><a href="mailto:${escape(b.email)}" style="color:${C.text}">${escape(b.email)}</a></p>
${meta.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:16px"><tr>${chips(meta)}</tr></table>` : ''}
${message(b.details)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr>
  <td>${button(reply, `Reply to ${escape(first)}`)}</td>
</tr></table>
<p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">Hitting Reply in your mail app also goes straight to ${escape(first)}. They were promised an answer within ${escape(config.responseTime)}.</p>`;
  return layout(`${b.name} sent a project brief${b.type ? ` — ${b.type}` : ''}`, body, `Sent from the contact form on <a href="${SITE}/contact" style="color:${C.muted}">${HOST}</a>`);
}

/** To the visitor: thanks, what happens next, and a copy of what they sent. */
export function confirmationEmail(b: Brief) {
  const first = firstName(b.name);
  const meta = ([['Project', b.type], ['Budget', b.budget], ['Timeline', b.timeline]] as [string, string][]).filter(([, v]) => v);
  const steps = hireProcess.slice(1).map((s, i) => `
<tr>
  <td valign="top" style="width:34px;padding:0 0 16px"><div style="width:26px;height:26px;border-radius:50%;background:${C.ink};color:#ffffff;font-size:12px;font-weight:700;line-height:26px;text-align:center">${i + 1}</div></td>
  <td valign="top" style="padding:2px 0 16px;font-size:15px;line-height:1.55;color:${C.text}"><strong style="color:${C.ink}">${s.title}.</strong> ${s.detail}</td>
</tr>`).join('');
  const body = `
<h1 style="margin:0 0 14px;font-size:30px;line-height:1.12;letter-spacing:-.025em">Thanks, ${escape(first)}.<br>Your brief is in.</h1>
<p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:${C.text}">I read every brief myself and will get back to you within <strong style="color:${C.ink}">${escape(config.responseTime)}</strong>. Need to add something? Just reply to this email.</p>
<div style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.muted}">What happens next</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px">${steps}</table>
<div style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.muted}">Your brief</div>
${meta.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px"><tr>${chips(meta)}</tr></table>` : ''}
${message(b.details)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:30px"><tr>
  <td style="padding:0 10px 10px 0;display:inline-block">${button(`${SITE}/works`, 'See recent work')}</td>
  ${config.whatsapp ? `<td style="padding:0 0 10px;display:inline-block">${button(`https://wa.me/${config.whatsapp.number}`, 'Message me on WhatsApp', false)}</td>` : ''}
</tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:22px;border-top:1px solid ${C.rule}"><tr><td style="padding-top:22px;font-size:15px;line-height:1.5;color:${C.ink}">
  <strong style="color:${C.ink}">${escape(config.name)}</strong><br>
  <span style="color:${C.muted}">${escape(config.role)} · ${escape(config.location.city)}, ${escape(config.location.country)} (${config.utcOffset})</span><br>
  ${[`<a href="${SITE}" style="color:${C.ink}">${HOST}</a>`, ...config.socials.map((s) => `<a href="${s.href}" style="color:${C.ink}">${escape(s.label)}</a>`)].join(' &nbsp;·&nbsp; ')}
</td></tr></table>`;
  return layout(
    `Thanks ${first} — I'll reply within ${config.responseTime}.`,
    body,
    `You are receiving this because you sent a project brief on <a href="${SITE}/contact" style="color:${C.muted}">${HOST}</a>.`,
  );
}
