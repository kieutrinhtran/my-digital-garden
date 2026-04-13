import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "src/site/notes/**/*.js",
      "src/content/blog/**",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
