// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import solidJs from "@astrojs/solid-js";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  base: "/popup-card-js",
  integrations: [
    starlight({
      title: "popup-card-js",
      social: {
        github: "https://github.com/nknapp/popup-card-js",
      },
      sidebar: [
        // Each item here is one entry in the navigation menu.
        { label: "Examples", autogenerate: { directory: "examples" } },
      ],
      customCss: ["./src/tailwind.css"],
    }),
    solidJs(),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false,
    }),
  ],
});
