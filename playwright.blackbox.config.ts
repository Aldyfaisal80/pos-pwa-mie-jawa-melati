import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/blackbox",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  outputDir: "generated/playwright-artifacts",
  reporter: [
    ["list"],
    ["json", { outputFile: "generated/blackbox/playwright-report.json" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 1440, height: 960 },
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3000",
    url: "http://localhost:3000",
    timeout: 180_000,
    reuseExistingServer: true,
  },
});
