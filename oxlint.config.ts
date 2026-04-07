import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["coverage/**", "dist/**", "node_modules/**", "tmp/**"],
  plugins: ["unicorn", "typescript", "oxc", "import"],
});
