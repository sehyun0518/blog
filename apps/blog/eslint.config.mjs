import { nextConfig } from "@blog/config/eslint";

export default [
  ...nextConfig,
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
  },
];
