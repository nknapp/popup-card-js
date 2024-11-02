import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src",
  testMatch: "*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  expect: {
    timeout: 1000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        connectOptions: {
          wsEndpoint: "ws://localhost:3000/",
        },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        connectOptions: {
          wsEndpoint: "ws://localhost:3000/",
        },
      },
    },
  ],
  webServer: {
    command: "npm run dev:server -- --port 5173",
    url: "http://localhost:5173",
    stdout: "pipe",
    timeout: 10000,
    reuseExistingServer: !process.env.CI,
  },
});
