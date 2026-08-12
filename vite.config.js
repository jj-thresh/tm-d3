import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Relative base so the built site works under a GitHub Pages project subpath
// (https://<user>.github.io/<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: './',
  // Real multi-page site: don't silently fall back to index.html for
  // not-yet-built pages (e.g. connect.html before it exists) — 404 instead.
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        capabilities: resolve(__dirname, 'capabilities.html'),
        work: resolve(__dirname, 'work.html'),
        insights: resolve(__dirname, 'insights.html'),
        connect: resolve(__dirname, 'connect.html'),
      },
    },
  },
});
