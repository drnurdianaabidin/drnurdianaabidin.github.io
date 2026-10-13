// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadSettings, configFiles } from './src/lib/site-config.mjs';
import { satteri } from '@astrojs/markdown-satteri';
import { placeholderPlugin } from './src/lib/placeholder.mjs';

const settings = loadSettings();

export default defineConfig({
  site: settings.siteUrl,
  trailingSlash: 'ignore',
  integrations: [
    sitemap(),
    {
      // Restart the preview when the settings or sections files change.
      name: 'watch-settings',
      hooks: {
        'astro:config:setup': ({ addWatchFile }) => {
          for (const file of configFiles) addWatchFile(file);
        },
      },
    },
  ],
  markdown: {
    // Highlights [[placeholder]] text in the body of each piece of work.
    processor: satteri({ hastPlugins: [() => placeholderPlugin()] }),
  },
  image: {
    responsiveStyles: true,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
  vite: {
    // Keep every file (CV, videos, PDFs) as a separate download.
    build: { assetsInlineLimit: 0 },
  },
});
