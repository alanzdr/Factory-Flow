import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    silent: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "factory-flow": path.resolve(__dirname, "src"),
    },
  },
});
