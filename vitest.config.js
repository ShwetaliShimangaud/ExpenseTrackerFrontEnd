import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true, // Enables Vitest globals (describe, it, expect, etc.)
  },
  resolve: {
    alias: {
      '@': '/src', // Maps @/ to src/
    },
  },
});