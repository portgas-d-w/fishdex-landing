import { defineConfig } from 'vite';

export default defineConfig({
  // Le propriétaire veut aussi essayer le jeu sur le domaine public.
  // ProfileStorage conserve deux sauvegardes et deux espaces photo distincts.
  define: { __TEST_MODE_ENABLED__: 'true' },
  server: { host: '0.0.0.0' },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
});
