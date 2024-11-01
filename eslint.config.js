import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["playwright-report/", "dist/", "docs/.astro/"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "no-restricted-imports": ["error",{
        name: "three",
        message: "User src/vendor/three instead"
      },{
        name: "@dimforge/rapier3d-compat",
        message: "User src/vendor/rapier instead"
      }]
    }
  },
];
