import { defineConfig, devices } from '@playwright/test';

// Лаб 1: Playwright тохиргоо
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    // saucedemo нь data-test атрибут ашигладаг тул getByTestId үүгээр ажиллана
    testIdAttribute: 'data-test',
    trace: 'on',
    video: 'on',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
