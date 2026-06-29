import { defineConfig } from "@playwright/test";
import process from "node:process";

const port = 4173;
const host = "127.0.0.1";
const basePath = "/canada-under-carney/";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  reporter: [["list"]],
  use: {
    browserName: "chromium",
    baseURL: `http://${host}:${port}${basePath}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run build && npm run preview -- --host ${host} --port ${port}`,
    url: `http://${host}:${port}${basePath}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {},
    },
    {
      name: "chromium-reduced-motion",
      use: {
        reducedMotion: "reduce",
      },
    },
    {
      name: "chromium-dark",
      use: {
        colorScheme: "dark",
      },
    },
  ],
});
