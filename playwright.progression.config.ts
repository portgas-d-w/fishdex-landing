import {defineConfig,devices} from '@playwright/test';
// Parcours sans API QA : même contrat sur build local, revue protégée et domaine public.
export default defineConfig({
 testDir:'./tests/browser',testMatch:['curriculum.spec.ts','shop.spec.ts'],workers:1,timeout:60000,expect:{timeout:15000},
 use:{baseURL:process.env.GAME_URL??'http://127.0.0.1:4173',trace:process.env.VERCEL_OIDC_TOKEN?'off':'retain-on-failure',launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}},
 projects:[{name:'desktop',use:{viewport:{width:1440,height:900}}},{name:'mobile',use:{...devices['iPhone 13'],viewport:{width:390,height:844},defaultBrowserType:'chromium'}}],
 ...(process.env.GAME_URL?{}:{webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',port:4173,reuseExistingServer:false}}),
});
