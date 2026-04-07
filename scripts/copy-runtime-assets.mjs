import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("src/templates");
const targetDir = path.resolve("dist/templates");

if (existsSync(targetDir)) {
  rmSync(targetDir, { force: true, recursive: true });
}

cpSync(sourceDir, targetDir, { recursive: true });
