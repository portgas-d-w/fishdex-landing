import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Contenu en français : apostrophes/accents typographiques dans le JSX.
      'react/no-unescaped-entities': 'off',
      // Règles "React Compiler" (purity) trop strictes pour le code Three.js / R3F :
      // dessin canvas avec Math.random, <primitive object={ref.current}>, mutation
      // de textures, détection device au montage. Ce sont des patterns R3F légitimes,
      // pas des bugs → en warning (visibles) plutôt que bloquants.
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
