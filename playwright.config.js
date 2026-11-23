import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4183';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: `python3 -m http.server 4183 --bind 127.0.0.1 --directory ${JSON.stringify(process.env.E2E_SITE_DIR ?? '.')}`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'ignore',
  },
});
