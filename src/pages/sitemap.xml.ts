import type { APIRoute } from 'astro';
import { insights } from '../data/insights';
import { projects } from '../data/projects';
import { services } from '../data/site';

// Built from the data modules, so new projects and articles are listed automatically.
export const GET: APIRoute = ({ site }) => {
  const latestInsight = insights.map((i) => i.date).sort().at(-1);
  const pages: { path: string; lastmod?: string; priority: string }[] = [
    { path: '/', priority: '1.0' },
    { path: '/works', priority: '0.9' },
    ...projects.filter((p) => p.caseStudy).map((p) => ({ path: `/work/${p.slug}`, priority: '0.8' })),
    { path: '/contact', priority: '0.9' },
    { path: '/services', priority: '0.9' },
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: '0.9' })),
    { path: '/insights', lastmod: latestInsight, priority: '0.7' },
    ...insights.map((i) => ({ path: `/insight/${i.slug}`, lastmod: i.date, priority: '0.6' })),
    { path: '/privacy-policy', priority: '0.2' },
  ];

  const urls = pages
    .map(
      (p) =>
        `  <url><loc>${new URL(p.path, site)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}<priority>${p.priority}</priority></url>`,
    )
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
