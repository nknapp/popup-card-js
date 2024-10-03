import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    exclude: [...configDefaults.exclude, "**/*.spec.ts"],
  },
});
