import type { APIRoute } from 'astro';
import { insights } from '../data/insights';
import { categoryLabel, projects } from '../data/projects';
import { about, clients, config, faq, hero, hireProcess, seo, services } from '../data/site';

// llms.txt (https://llmstxt.org): a plain-text brief that AI assistants can read
// when someone asks them for a web developer. Built from the same data as the site.
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).toString();
  const caseStudies = projects.filter((p) => p.caseStudy);
  const otherWork = projects.filter((p) => !p.caseStudy);

  const text = `# ${config.name}

> ${seo.description}

${hero.intro}

${about.statement}

${about.detail}

- Based in: ${config.location.city}, ${config.location.country} (${config.utcOffset}), working remotely with clients worldwide
- Languages: ${config.languages.map((l) => l.name).join(', ')}
- Clients include: ${clients.join(', ')}
- ${hero.proof.map((p) => `${p.title} ${p.detail}`).join('; ')}

## Services

${services.map((s) => `- [${s.headline}](${url(`/services/${s.slug}`)}): ${s.description} (${s.items.join(', ')})`).join('\n')}

## How to hire ${config.shortName}

${hireProcess.map((step, i) => `${i + 1}. **${step.title}**: ${step.detail}`).join('\n')}

Start here: ${url('/contact')}

## FAQ

${faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Case studies

${caseStudies.map((p) => `- [${p.title}](${url(`/work/${p.slug}`)}): ${p.summary} — ${p.industry}, ${categoryLabel(p.category)}, ${p.year}`).join('\n')}

## More work

${otherWork.map((p) => `- [${p.title}](${p.url ?? url('/works')}): ${p.summary}`).join('\n')}

## Insights

${insights.map((i) => `- [${i.title}](${url(`/insight/${i.slug}`)}) (${i.category}, ${i.date})`).join('\n')}

## Contact

- Start a project: ${url('/contact')}
- Email: ${config.email}
${[
  config.whatsapp && `- WhatsApp: ${config.whatsapp.label} (https://wa.me/${config.whatsapp.number})`,
  ...config.socials.map((s) => `- ${s.label}: ${s.href}`),
]
  .filter(Boolean)
  .join('\n')}
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
