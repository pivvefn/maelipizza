

import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",

      "stitch-export/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {

    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
