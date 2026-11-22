// Site copy: hero, services, hiring process, FAQ, about, testimonials and the privacy text.
// Identity and contact details come from `src/config.ts`.
import portrait from '../assets/portrait.webp';
import { config } from '../config';

export { config };

/** Placeholder portrait (an initials avatar). Replace `src/assets/portrait.webp` with your photo. */
export const portraitImage = {
  src: portrait,
  alt: `Portrait of ${config.name}`,
};

export const seo = {
  title: `${config.name} — ${config.role} (Next.js, Astro, React)`,
  description:
    'Freelance web developer working remotely with clients worldwide. Fast websites and web apps in Next.js, Astro and React — headless CMS, Stripe payments and AI features.',
};

export const nav = [
  { label: 'Work', href: '/works' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/#about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

export const hero = {
  headline: 'Websites that load fast and sell harder.',
  intro: `I'm ${config.shortName}, a freelance web developer in ${config.location.city}. I build fast, modern websites and web apps with React, Next.js and Astro, from headless CMS builds to Stripe payments and AI-powered features.`,
  // Proof points under the intro: keep them short and verifiable, and link each to its evidence.
  proof: [
    { title: '8+ years', detail: 'building for the web', href: '/#about' },
    { title: '40+ projects', detail: 'shipped for founders and teams', href: '/works' },
    { title: 'Kind words', detail: 'from past clients', href: '/#testimonials' },
  ],
};

/** Names in the scrolling marquee under the hero. Sample names, replace with your clients. */
export const clients = [
  'Northwind Coffee',
  'Acme Analytics',
  'Harbor & Pine',
  'Lumen Health',
  'Fieldnote',
  'Pebble Studio',
  'Kitepost',
  'Juniper Labs',
];

// Each service also has its own page at /services/<slug>, written for people searching to hire.
// `category` links a service to the projects shown as related work.
export const services = [
  {
    slug: 'web-development',
    category: 'websites' as const,
    title: 'Web development',
    seoTitle: 'Hire a Freelance Next.js, React & Astro Developer',
    headline: 'Freelance Next.js, React and Astro development',
    intro:
      'Marketing sites, product sites and web apps that load fast, rank well and stay easy to change. I pick the framework that fits the project and hand over code your team can keep working in.',
    description:
      'Production-ready websites and web apps built with modern frameworks — fast, accessible, and easy to maintain.',
    items: ['React & Next.js', 'Astro', 'Performance & SEO', 'Accessibility'],
    link: { label: 'View website projects', href: '/works?filter=websites' },
  },
  {
    slug: 'headless-cms',
    category: 'cms' as const,
    title: 'CMS and content',
    seoTitle: 'Hire a Headless CMS Developer (Payload, Sanity, Strapi)',
    headline: 'Headless CMS development with Payload, Sanity and Strapi',
    intro:
      'A content model shaped around how your team actually publishes, an editor they enjoy using, and a fast frontend on top. I set up the CMS, migrate existing content, and make sure new pages never need a developer.',
    description:
      'Headless CMS builds that let your team publish, edit, and launch pages without ever touching code.',
    items: ['Payload CMS', 'Sanity', 'Strapi', 'Content modelling & migration'],
    link: { label: 'See CMS projects', href: '/works?filter=cms' },
  },
  {
    slug: 'ai-and-integrations',
    category: 'ai' as const,
    title: 'AI and integrations',
    seoTitle: 'Hire a Developer for Stripe, API & AI Integrations',
    headline: 'Stripe, API and AI integrations for your website',
    intro:
      'Checkout and subscriptions with Stripe, third-party APIs and webhooks, and AI features such as assistants and search over your own content, built to survive real traffic rather than a demo.',
    description:
      'Payments, third-party APIs, and AI features wired into your site — from Stripe checkout to custom assistants.',
    items: ['Stripe & payment flows', 'APIs & webhooks', 'AI assistants & search', 'Automation & internal tools'],
    link: { label: 'Explore AI projects', href: '/works?filter=ai' },
  },
];

/** How hiring works, shown on the contact page and the service pages (also in the confirmation email). */
export const hireProcess = [
  { title: 'Send a brief', detail: 'Use the form or email me. A few lines on what you are building is enough.' },
  { title: 'Short call', detail: `We go through goals, scope, timeline and budget. I reply to every brief within ${config.responseTime}.` },
  { title: 'Estimate', detail: 'You get a written scope, timeline and price before any work starts.' },
  { title: 'Build and launch', detail: 'I build in small steps you can review along the way, then launch and stay on hand for fixes and new features.' },
];

/** Shown on the contact and service pages, and published as FAQPage structured data. */
export const faq = [
  {
    q: 'How do I hire you?',
    a: `Send a project brief through the contact form or email ${config.email}. I reply within ${config.responseTime}.`,
  },
  {
    q: 'Do you work with clients in other countries?',
    a: `Yes. I work remotely, in English, with founders and teams worldwide. I am based in ${config.location.city} (${config.utcOffset}).`,
  },
  {
    q: 'What does a project cost?',
    a: 'It depends on scope. Most projects fall between $1k and $10k+, and the contact form lets you pick a range. After a short call you get a written scope, timeline and price before any work starts.',
  },
  {
    q: 'Which technologies do you use?',
    a: 'React, Next.js and Astro on the frontend; Payload CMS, Sanity and Strapi for content; Stripe for payments; and AI features such as assistants and search. I go full-stack when a project needs it.',
  },
  {
    q: 'Can my team edit the website after launch?',
    a: 'Yes. With a headless CMS such as Payload, Sanity or Strapi your team publishes pages, news and campaigns without waiting on a developer.',
  },
];

export const faqSchema = {
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export const about = {
  statement:
    'Most of my work is on the frontend, but I go full-stack when a project needs it. I care about the details people feel without noticing: pages that load instantly, forms that never lose your input, and an editor your team actually enjoys.',
  detail:
    'I work with founders, agencies and in-house teams, from coffee roasters and design studios to SaaS products. Some projects are a two-week launch; others are a long-running partnership where I keep shipping features every month.',
  facts: [
    { label: 'Based in', value: `${config.location.city}, ${config.location.country}` },
    { label: 'Working with', value: 'Clients worldwide' },
    { label: 'Stack', value: 'React, Next.js, Astro' },
  ],
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  /** Project slug: the quote also appears on that case study. */
  project?: string;
};

// SAMPLE TESTIMONIALS: fictional people and companies, for the template preview only.
// Replace them with real quotes your clients have approved, or empty the array to hide the
// section. Never publish invented testimonials.
export const testimonials: Testimonial[] = [
  {
    quote:
      'Our online shop finally feels as good as our coffee. Pages load instantly, subscriptions just work, and we launch new blends ourselves.',
    name: 'Sample Client',
    role: 'Founder, Northwind Coffee (sample)',
    initials: 'SC',
    project: 'northwind-coffee',
  },
  {
    quote:
      'The dashboard went from something we apologised for to the thing customers mention on sales calls. Clear, fast, and shipped on schedule.',
    name: 'Example Person',
    role: 'Head of Product, Acme Analytics (sample)',
    initials: 'EP',
    project: 'acme-analytics',
  },
];

export const privacy = {
  updated: 'January 2026',
  sections: [
    {
      title: 'What this site collects',
      body: 'This website collects only the information you choose to submit through the contact form — your name, email address, and the project details you provide. Nothing else is collected, and no tracking cookies are set.',
    },
    {
      title: 'How it’s used',
      body: 'Contact form submissions are used solely to respond to your enquiry. They are never sold, shared, or used for marketing. Messages are delivered by email through Resend.',
    },
    {
      title: 'Questions',
      body: `For any questions about your data, email ${config.email}.`,
    },
  ],
};
