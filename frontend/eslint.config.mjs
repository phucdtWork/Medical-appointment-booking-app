import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/page/doctor-detail/**"],
    rules: {
      "@next/next/no-css-tags": "off",
      "@next/next/no-unsafe-css-in-js": "off",
      "@next/next/no-inline-styles": "off",
      "@next/next/no-img-element": "off",
      "react/forbid-dom-props": "off",
      "react-dom/no-dangerously-set-innerhtml": "off",
      "jsx-a11y/no-static-element-interactions": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

