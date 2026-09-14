import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@/config": path.resolve(__dirname, "src/config"),
      "@/context": path.resolve(__dirname, "src/context"),
      "@": path.resolve(__dirname, "."),
    },
  },
})
