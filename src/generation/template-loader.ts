import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function createTemplateUrl(relativePath: string): URL {
  return new URL(`../templates/${relativePath}`, import.meta.url);
}

export function loadTemplate(relativePath: string): string {
  return readFileSync(fileURLToPath(createTemplateUrl(relativePath)), "utf8");
}
