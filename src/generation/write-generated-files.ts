import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GeneratedFile, WriteGeneratedFilesOptions } from "../domain/types";

export function findExistingGeneratedFiles(targetDir: string, files: GeneratedFile[]): string[] {
  return files.map((file) => path.resolve(targetDir, file.path)).filter((absolutePath) => existsSync(absolutePath));
}

export async function writeGeneratedFiles(
  targetDir: string,
  files: GeneratedFile[],
  options: WriteGeneratedFilesOptions = {},
): Promise<void> {
  const existingFiles = findExistingGeneratedFiles(targetDir, files);

  if (existingFiles.length > 0 && !options.overwrite) {
    throw new Error(`Refusing to overwrite existing file: ${existingFiles[0]}`);
  }

  if (options.overwrite && existsSync(targetDir)) {
    await rm(targetDir, { force: true, recursive: true });
  }

  for (const file of files) {
    const absolutePath = path.resolve(targetDir, file.path);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.content, "utf8");
  }
}
