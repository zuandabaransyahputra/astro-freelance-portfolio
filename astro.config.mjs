// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { siteUrl } from './src/config.ts';

export default defineConfig({
  // From `url` in src/config.ts, or the SITE_URL environment variable.
  site: siteUrl,
  // Pages stay static; only /api/contact (prerender = false) runs as a Vercel function.
  adapter: vercel(),
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    // The CSS is small, so inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
});
