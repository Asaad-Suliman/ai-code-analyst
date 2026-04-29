import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "e2e_demo.spec.js",
  timeout: 90_000,
  use: {
    headless: false,
    baseURL: "http://localhost:5173",
    viewport: { width: 1400, height: 900 },
    video: "off",
    slowMo: 200,
  },
  workers: 1,
});
