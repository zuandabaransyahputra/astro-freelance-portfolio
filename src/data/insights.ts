// SAMPLE ARTICLES: short placeholder posts that show every block type (paragraph, heading,
// figure, pull quote). Replace them with your own writing; the first block should be a
// paragraph, which becomes the intro and the meta description. Art lives in src/assets/insights/.
import type { ImageMetadata } from 'astro';

import art1 from '../assets/insights/insight-1.svg';
import art2 from '../assets/insights/insight-2.svg';
import art3 from '../assets/insights/insight-3.svg';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'figure'; caption: string }
  | { type: 'quote'; text: string };

export type Insight = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: ImageMetadata;
  blocks: Block[];
};

export const insights: Insight[] = [
  {
    slug: 'choosing-a-framework',
    title: 'Choosing a Framework Without the Hype',
    category: 'Development',
    date: '2026-01-20',
    readTime: '4 min read',
    image: art1,
    blocks: [
      {
        type: 'p',
        text: 'Clients rarely care which framework their site runs on. They care that it ships on time, loads fast, and can be maintained by whoever comes next. So the framework question is really a risk question.',
      },
      { type: 'h2', text: 'Start from the shape of the content' },
      {
        type: 'p',
        text: 'A content site that changes a few times a month wants static pages and almost no JavaScript. An app with accounts and dashboards wants a framework built for that. Most projects are clearly one or the other once you look at the content.',
      },
      { type: 'figure', caption: 'Content shape → framework choice' },
      { type: 'quote', text: 'Pick the tool whose failure modes you understand.' },
      {
        type: 'p',
        text: 'Whatever you choose, write the decision down. A one-page rationale saves the next developer a week of archaeology.',
      },
    ],
  },
  {
    slug: 'model-content-not-pages',
    title: 'Model Content, Not Pages',
    category: 'CMS',
    date: '2025-11-04',
    readTime: '3 min read',
    image: art2,
    blocks: [
      {
        type: 'p',
        text: 'Every headless CMS demo looks great. The differences show up six months in, and they are almost always about how the content was modelled.',
      },
      { type: 'h2', text: 'Name the things the business talks about' },
      {
        type: 'p',
        text: 'Resist mirroring the design in the schema. Model products, people, places and events, and let pages compose them. That is what keeps a CMS useful through the next redesign.',
      },
      { type: 'figure', caption: 'Entities on the left, pages on the right' },
    ],
  },
  {
    slug: 'performance-is-a-feature',
    title: 'Performance Is a Feature',
    category: 'Performance',
    date: '2025-09-15',
    readTime: '3 min read',
    image: art3,
    blocks: [
      {
        type: 'p',
        text: 'A fast site is not a technical nicety. It is the first thing every visitor experiences, long before they read a word of your copy.',
      },
      { type: 'h2', text: 'Budget it like any other feature' },
      {
        type: 'p',
        text: 'Set a budget for JavaScript, images and fonts at the start of the project, and check it on every pull request. It is far cheaper than a performance rescue after launch.',
      },
      { type: 'quote', text: 'The fastest request is the one you never make.' },
      { type: 'figure', caption: 'Where the bytes go on a typical page' },
    ],
  },
];

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
