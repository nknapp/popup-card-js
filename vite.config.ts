import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["three","@dimforge/rapier3d-compat"]
    },
    sourcemap: true,
  },
  test: {
    exclude: [...configDefaults.exclude, "**/*.spec.ts"],
    environment: "jsdom",
  },
});
