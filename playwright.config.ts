import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import { AUTH_FILE } from './src/data/auth';

loadEnv();

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  failOnFlakyTests: false,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts$/,
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    // Опционально: npx playwright install firefox webkit, затем раскомментировать.
    // Эти проекты не входят в основной прогон и пока не заявлены как проверенные.
    // {
    //   name: 'firefox',
    //   testMatch: /.*\.spec\.ts$/,
    //   use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   testMatch: /.*\.spec\.ts$/,
    //   use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
    //   dependencies: ['setup'],
    // },
  ],
});
