import { defineConfig } from 'vite';

export default defineConfig({
  define: { __TEST_MODE_ENABLED__: JSON.stringify(process.env.VERCEL_ENV==='preview'||process.env.FISHING_TEST_BUILD==='1') },
  server: { host: '0.0.0.0' },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
});
