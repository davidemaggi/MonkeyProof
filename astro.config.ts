import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

const fontsource = (pkg: string, file: string) =>
  `./node_modules/@fontsource-variable/${pkg}/files/${file}`;

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  compressHTML: true,
  integrations: [
    mdx({
      extendMarkdownConfig: true,
    }),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "github-light", dark: "github-dark-default" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  // Same faces as DaveOS (davidemaggi.dev), self-hosted.
  fonts: [
    {
      name: "Space Grotesk",
      cssVariable: "--font-display",
      fallbacks: ["system-ui", "sans-serif"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [fontsource("space-grotesk", "space-grotesk-latin-wght-normal.woff2")],
            weight: "300 700",
            style: "normal",
          },
        ],
      },
    },
    {
      name: "Inter",
      cssVariable: "--font-body",
      fallbacks: ["system-ui", "sans-serif"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [fontsource("inter", "inter-latin-wght-normal.woff2")],
            weight: "100 900",
            style: "normal",
          },
          {
            src: [fontsource("inter", "inter-latin-wght-italic.woff2")],
            weight: "100 900",
            style: "italic",
          },
        ],
      },
    },
    {
      // Handwritten voice from the original MonkeyProof theme: notes, asides, <em>.
      name: "Sriracha",
      cssVariable: "--font-hand",
      fallbacks: ["cursive"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./node_modules/@fontsource/sriracha/files/sriracha-latin-400-normal.woff2"],
            weight: 400,
            style: "normal",
          },
        ],
      },
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      fallbacks: ["ui-monospace", "monospace"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [fontsource("jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2")],
            weight: "100 800",
            style: "normal",
          },
          {
            src: [fontsource("jetbrains-mono", "jetbrains-mono-latin-wght-italic.woff2")],
            weight: "100 800",
            style: "italic",
          },
        ],
      },
    },
  ],
});
