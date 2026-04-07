import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: [
    "coverage/**",
    "demo-dist/**",
    "lib/**",
    "node_modules/**",
  ],
  plugins: ["unicorn", "typescript", "oxc", "import", "vue"],
});
