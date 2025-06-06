import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts", // Path to your setup file
    css: true, // If you have global CSS or component-specific CSS
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"],
    },
  },
});
