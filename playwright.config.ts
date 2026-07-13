import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: "zsh -lc 'set -a; source .vercel/.env.production.local; set +a; npm run dev -- -p 3003'", url: 'http://127.0.0.1:3003', reuseExistingServer: true, timeout: 120_000 },
  use: { baseURL: 'http://127.0.0.1:3003', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
});
