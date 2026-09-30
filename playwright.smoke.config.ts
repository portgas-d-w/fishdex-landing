import { defineConfig, devices } from '@playwright/test';

// Même contrôle du build local, de la préproduction et de la production.
export default defineConfig({
  testDir: './tests/smoke', workers: 1, timeout: 120_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: process.env.GAME_URL || 'http://127.0.0.1:4173',
    trace: process.env.VERCEL_OIDC_TOKEN ? 'off' : 'retain-on-failure',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, defaultBrowserType: 'chromium' } },
  ],
});
