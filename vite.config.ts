/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    // Keep images out of the JS bundle: base64 inlining inflates them ~33%
    // and gzips far worse than a separately cached binary file.
    assetsInlineLimit: 0,
  },
});
