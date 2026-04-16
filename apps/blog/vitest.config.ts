import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    server: {
      deps: {
        external: ["next"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/__tests__/**",
        "src/lib/env.ts",
        "src/middleware.ts",
        "src/app/**",
      ],
    },
  },
});
