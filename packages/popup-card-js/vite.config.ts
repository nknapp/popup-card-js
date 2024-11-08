import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

// vite.config.ts is only used for local development and manual tests
export default defineConfig({
  plugins: [],
  build: {
    outDir: "dist-manual-tests",
  },
  test: {
    exclude: [...configDefaults.exclude, "**/*.spec.ts"],
    environment: "jsdom",
  },
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
