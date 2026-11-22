/**
 * Everything that identifies you lives here: name, contact details, socials, location and the
 * options on the contact form. Pages, JSON-LD, llms.txt, the sitemap, the emails and the share
 * image all read from this file, so it is the first (and often only) file you need to edit.
 *
 * Keep this file free of imports: `scripts/build-og.mjs` and `astro.config.mjs` load it directly.
 */

export type Social = {
  /** Shown as the link text in the footer and as the row label on the contact page. */
  label: string;
  /** Shown next to the label (a handle or short call to action). */
  handle: string;
  href: string;
};

export const config = {
  /** Production URL, no trailing slash. `SITE_URL` (env) overrides it at build time. */
  url: 'https://example.com',

  name: 'Avery Lane',
  /** Used in friendly copy ("Hire Avery", "I'm Avery"). */
  shortName: 'Avery',
  /** One or two characters for the logo mark, favicon, email header and share image. */
  monogram: 'A',
  /** Short role, used in titles, emails and JSON-LD `jobTitle`. */
  role: 'Freelance Web Developer',

  location: {
    city: 'Lisbon',
    country: 'Portugal',
    /** ISO 3166-1 alpha-2, for JSON-LD `addressCountry`. */
    countryCode: 'PT',
  },
  /** IANA time zone for the live local clock (header, hero, contact page, footer). */
  timeZone: 'Europe/Lisbon',
  /** Label shown next to the clock. */
  utcOffset: 'UTC+0',
  /** Languages you work in: `code` (BCP 47) for JSON-LD `knowsLanguage`, `name` for people. */
  languages: [{ code: 'en', name: 'English' }],

  email: 'hello@example.com',
  /**
   * Optional. Set to `{ label: '+351 900 000 000', number: '351900000000' }` (digits only, with
   * country code) to show WhatsApp links and the "Send on WhatsApp" button on the contact form.
   */
  whatsapp: null as null | { label: string; number: string },

  /** Profiles that are yours; also used for JSON-LD `sameAs` and `<link rel="me">`. */
  socials: [
    { label: 'GitHub', handle: 'your-username', href: 'https://github.com/your-username' },
    { label: 'LinkedIn', handle: 'your-name', href: 'https://www.linkedin.com/in/your-name' },
  ] as Social[],

  /**
   * Optional second button next to "Start a project" (hero of the services pages).
   * Point it at a booking page or a marketplace profile, or set it to `null`.
   */
  secondaryCta: { label: 'Book a 20-minute call', href: 'https://cal.com/your-username' } as null | { label: string; href: string },

  availability: {
    /** Header pill and the rotating badge on the portrait. */
    short: 'Open for new projects',
    /** Contact band and contact page. */
    long: 'Currently accepting new projects',
  },
  /** How quickly you answer a brief; used on the contact page, in the FAQ and in emails. */
  responseTime: '1–2 business days',

  /** ISO 4217 code for JSON-LD `currenciesAccepted`. */
  currency: 'USD',
  /** Options on the contact form. */
  contactForm: {
    projectTypes: ['Website', 'E-commerce & Payments', 'Headless CMS', 'AI & Integrations', 'Other'],
    budgets: ['$1k–$3k', '$3k–$5k', '$5k–$10k', '$10k+'],
    timelines: ['ASAP', '1–2 months', '3+ months'],
  },
};

/** The site URL used everywhere (canonical links, sitemap, JSON-LD, emails). */
export const siteUrl = (
  (typeof process !== 'undefined' && process.env?.SITE_URL) ||
  config.url
).replace(/\/$/, '');

/** "example.com" for display. */
export const siteHost = new URL(siteUrl).host;
