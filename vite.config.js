import { defineConfig } from 'vite';

// Relative base so the built site works under a GitHub Pages project subpath
// (https://<user>.github.io/<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: './',
});
