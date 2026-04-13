import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "src/site/_**/**",
      "src/site/styles/**",
      "src/site/*.njk",
      "src/site/get-theme.js",
      "src/site/_data/**",
      "src/site/notes/**/*.js",
      "src/content/blog/**",
      "src/helpers/**",
      ".eleventy.js",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
