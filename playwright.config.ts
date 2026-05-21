import { defineConfig } from '@playwright/test';

// QA-Stufe 2: Visual Regression über 5 Breakpoints (siehe scripts/playwright-qa.spec.ts).
export default defineConfig({
  testDir: './scripts',
  testMatch: 'playwright-qa.spec.ts',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
