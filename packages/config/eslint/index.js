import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

/**
 * Base flat config array shared across all packages.
 * Consumers: import { baseConfig } from "@blog/config/eslint" and spread it.
 * @type {import("eslint").Linter.Config[]}
 */
const baseConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
      "react": reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["error", "warn"] }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

/**
 * Next.js-specific config. Used only in apps/blog.
 * @type {import("eslint").Linter.Config[]}
 */
const nextConfig = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];

export { baseConfig, nextConfig };
export default baseConfig;
