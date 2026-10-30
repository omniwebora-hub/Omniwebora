import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "playwright-report/**", "test-results/**", "qa/**"],
  },
  {
    rules: {
      // R3F idiom: per-frame mutation of three.js objects held in refs/memos is intentional.
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default config;
