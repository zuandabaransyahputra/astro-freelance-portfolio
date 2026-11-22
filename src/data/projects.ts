// SAMPLE PROJECTS: every company below is fictional and every screenshot in
// src/assets/projects/ is a generated placeholder. Replace them with your own work.
//
// A project with a `caseStudy` gets its own /work/<slug> page; without one, its card links to `url`.
// Screenshots: ideally 3200 × 2340 (16 : 11.7) .webp or .jpg. For `device: 'phone'`, capture the
// mobile layout as a centred column (36.1% → 63.9% of the width) of a desktop-sized image.
import type { ImageMetadata } from 'astro';

import northwind from '../assets/projects/northwind-coffee.webp';
import northwindDetail from '../assets/projects/northwind-coffee-detail.webp';
import acme from '../assets/projects/acme-analytics.webp';
import acmeDetail from '../assets/projects/acme-analytics-detail.webp';
import harbor from '../assets/projects/harbor-and-pine.webp';
import harborDetail from '../assets/projects/harbor-and-pine-detail.webp';
import lumen from '../assets/projects/lumen-health.webp';
import lumenDetail from '../assets/projects/lumen-health-detail.webp';
import fieldnote from '../assets/projects/fieldnote.webp';
import pebble from '../assets/projects/pebble-studio.webp';

export type Category = 'websites' | 'cms' | 'ai' | 'apps';

export const categories: { id: Category; label: string }[] = [
  { id: 'websites', label: 'Websites' },
  { id: 'cms', label: 'CMS' },
  { id: 'ai', label: 'AI & Integrations' },
  { id: 'apps', label: 'Apps' },
];

export type CaseStudy = {
  overview: string;
  challenge: string;
  caption: string;
  approach: string;
  build: string;
  results: string[];
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  summary: string;
  tags: string[];
  industry: string;
  year: string;
  category: Category;
  /** Shown in the mock browser's address bar. */
  domain?: string;
  /** Live site, when known. */
  url?: string;
  image: ImageMetadata;
  detail?: ImageMetadata;
  /** Brand-derived panel colour behind the screenshot. */
  tint: string;
  /** Whether text on the tint should be light or dark. */
  tone: 'light' | 'dark';
  /** Mobile-first products are shown on phones instead of in a browser. */
  device: 'browser' | 'phone';
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: 'northwind-coffee',
    title: 'Northwind Coffee',
    client: 'Northwind Coffee (sample)',
    summary:
      'An online shop and subscription service for a specialty coffee roaster — new blends launch from the CMS, and checkout takes under a minute.',
    tags: ['E-commerce', 'Stripe Subscriptions', 'Astro'],
    industry: 'Food & Beverage',
    year: '2025',
    category: 'websites',
    domain: 'northwind.example',
    image: northwind,
    detail: northwindDetail,
    tint: '#6b3f2a',
    tone: 'dark',
    device: 'browser',
    caseStudy: {
      overview:
        'Northwind Coffee is a fictional specialty roaster selling single-origin beans online and through a monthly subscription. This sample case study shows how a real write-up is laid out.',
      challenge:
        'The old shop was slow on phones, subscriptions were managed by hand in a spreadsheet, and every new blend needed a developer to add a page.',
      caption: 'Product pages built from structured content: origin, roast, tasting notes',
      approach:
        'Products are modelled as structured content so the same blend feeds the shop, the subscription picker and seasonal campaign pages. Pages are static and the cart is a small island of JavaScript.',
      build:
        'An Astro storefront with Stripe Checkout and Billing for subscriptions, webhooks that keep orders in sync, and a headless CMS for blends, brewing guides and campaigns.',
      results: [
        'Mobile pages load in under a second on a mid-range phone',
        'Subscriptions move from a spreadsheet to Stripe Billing',
        'The team launches new blends without a developer',
      ],
    },
  },
  {
    slug: 'acme-analytics',
    title: 'Acme Analytics',
    client: 'Acme Analytics (sample)',
    summary:
      'A product analytics dashboard with an AI assistant that answers questions about your own data in plain language.',
    tags: ['SaaS Dashboard', 'AI Assistant', 'Next.js'],
    industry: 'SaaS · Analytics',
    year: '2025',
    category: 'ai',
    domain: 'app.acme.example',
    image: acme,
    detail: acmeDetail,
    tint: '#2a2f6b',
    tone: 'dark',
    device: 'browser',
    caseStudy: {
      overview:
        'Acme Analytics is a fictional SaaS product that helps small teams understand how customers use their app. This sample shows a typical dashboard and AI integration project.',
      challenge:
        'Customers had the data but not the time: charts took seconds to load, and most questions needed someone who knew how to write a query.',
      caption: 'Ask a question, get a chart and the query behind it',
      approach:
        'Precomputed rollups make the common views instant. The assistant turns a question into a query against a safe, read-only view, and always shows its working.',
      build:
        'A Next.js dashboard with streaming server components, a typed query layer, and an assistant built on tool calling with guardrails and evaluation tests.',
      results: [
        'Dashboard views render in a fraction of the previous time',
        'Plain-language questions answered with a chart and its query',
        'Every assistant answer is traceable to the data behind it',
      ],
    },
  },
  {
    slug: 'harbor-and-pine',
    title: 'Harbor & Pine',
    client: 'Harbor & Pine (sample)',
    summary:
      'A portfolio site for an architecture studio, with a headless CMS that lets the team publish projects in an afternoon.',
    tags: ['Headless CMS', 'Portfolio', 'Image Pipeline'],
    industry: 'Architecture & Design',
    year: '2024',
    category: 'cms',
    domain: 'harborandpine.example',
    image: harbor,
    detail: harborDetail,
    tint: '#2f5d50',
    tone: 'dark',
    device: 'browser',
    caseStudy: {
      overview:
        'Harbor & Pine is a fictional architecture studio. Its site is mostly photography, so the build is about images that look sharp and load fast.',
      challenge:
        'Each project page was assembled by hand, images were exported at the wrong sizes, and the studio waited weeks to show finished work.',
      caption: 'Project pages composed from reusable blocks in the CMS',
      approach:
        'A small set of flexible blocks — gallery, plan, quote, credits — covers every project. The image pipeline crops, resizes and converts on build.',
      build:
        'A static site on a headless CMS with live preview, responsive AVIF/WebP images, and page transitions that carry a photo from the grid into its project.',
      results: [
        'New projects go live the same day they are photographed',
        'Images are a fraction of their previous weight',
        'One content model serves the site, press kit and awards entries',
      ],
    },
  },
  {
    slug: 'lumen-health',
    title: 'Lumen Health',
    client: 'Lumen Health (sample)',
    summary:
      'A mobile-first web app for building healthy habits, with reminders, streaks and a calm, accessible interface.',
    tags: ['Progressive Web App', 'Accessibility', 'Offline-first'],
    industry: 'Health & Wellness',
    year: '2024',
    category: 'apps',
    domain: 'lumen.example',
    image: lumen,
    detail: lumenDetail,
    tint: '#d9e8e2',
    tone: 'light',
    device: 'phone',
    caseStudy: {
      overview:
        'Lumen Health is a fictional habit tracker. It shows how mobile-first products appear in this template: on two phones instead of a browser window.',
      challenge:
        'People use habit apps in short bursts, often offline, and often with one hand. Every extra tap is a reason to stop.',
      caption: 'Daily check-in in two taps, online or off',
      approach:
        'The app is designed around a single daily check-in. Data is stored on the device first and synced when a connection returns.',
      build:
        'An installable PWA with a service worker, local storage that syncs in the background, push reminders, and an interface tested with screen readers.',
      results: [
        'Check-ins work fully offline',
        'Meets WCAG 2.2 AA across the core flows',
        'Installable on iOS and Android without an app store',
      ],
    },
  },
  {
    slug: 'fieldnote',
    title: 'Fieldnote',
    client: 'Fieldnote (sample)',
    summary: 'A publishing site for a long-form travel journal, with a newsletter and a members-only archive.',
    tags: ['Publishing', 'Newsletter', 'Memberships'],
    industry: 'Media · Travel',
    year: '2024',
    category: 'cms',
    domain: 'fieldnote.example',
    url: 'https://example.com',
    image: fieldnote,
    tint: '#e8dcc6',
    tone: 'light',
    device: 'browser',
  },
  {
    slug: 'pebble-studio',
    title: 'Pebble Studio',
    client: 'Pebble Studio (sample)',
    summary: 'A booking site for a ceramics studio: classes, open studio hours and gift cards, paid online.',
    tags: ['Bookings', 'Payments', 'Next.js'],
    industry: 'Arts & Education',
    year: '2023',
    category: 'websites',
    domain: 'pebble.example',
    url: 'https://example.com',
    image: pebble,
    tint: '#c8573a',
    tone: 'dark',
    device: 'browser',
  },
];

/** Projects shown as the sticky stack on the home page (need a case study). */
export const featuredSlugs = ['northwind-coffee', 'acme-analytics', 'harbor-and-pine', 'lumen-health'];

export const projectHref = (p: Project) => (p.caseStudy ? `/work/${p.slug}` : (p.url ?? '#'));
export const isExternal = (p: Project) => !p.caseStudy;
export const categoryLabel = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
