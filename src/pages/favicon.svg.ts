import type { APIRoute } from 'astro';
import { config } from '../config';

// The favicon is a monogram tile built from `config.monogram`, so it changes with your name.
// Prefer your own artwork? Put a favicon.svg in public/ and delete this file.
export const GET: APIRoute = () => {
  const letters = config.monogram.slice(0, 2);
  const size = letters.length > 1 ? 28 : 38;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#14171f"/>
  <text x="32" y="33" dominant-baseline="central" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="700" fill="#f2f3f5">${letters}</text>
  <circle cx="51" cy="13" r="4" fill="#c8174f"/>
</svg>
`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
