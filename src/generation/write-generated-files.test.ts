import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { GeneratedFile } from "../domain/types";
import { findExistingGeneratedFiles, writeGeneratedFiles } from "./write-generated-files";

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "create-univer-plugin-"));
  tempDirs.push(tempDir);
  return tempDir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((tempDir) => rm(tempDir, { force: true, recursive: true })));
});

describe("writeGeneratedFiles", () => {
  it("writes generated files into a new directory", async () => {
    const targetDir = await createTempDir();
    const files: GeneratedFile[] = [
      { path: ".gitignore", content: "node_modules\n" },
      { path: "src/index.ts", content: "export const value = 1;\n" },
    ];

    await writeGeneratedFiles(targetDir, files);

    await expect(readFile(path.join(targetDir, ".gitignore"), "utf8")).resolves.toBe("node_modules\n");
    await expect(readFile(path.join(targetDir, "src/index.ts"), "utf8")).resolves.toBe("export const value = 1;\n");
  });

  it("finds conflicts and refuses to overwrite by default", async () => {
    const targetDir = await createTempDir();
    const filePath = path.join(targetDir, ".gitignore");
    await writeFile(filePath, "old\n", "utf8");
    const files: GeneratedFile[] = [{ path: ".gitignore", content: "new\n" }];

    expect(findExistingGeneratedFiles(targetDir, files)).toEqual([filePath]);
    await expect(writeGeneratedFiles(targetDir, files)).rejects.toThrow(
      `Refusing to overwrite existing file: ${filePath}`,
    );
    await expect(readFile(filePath, "utf8")).resolves.toBe("old\n");
  });

  it("overwrites existing files when enabled", async () => {
    const targetDir = await createTempDir();
    const filePath = path.join(targetDir, ".gitignore");
    const staleFilePath = path.join(targetDir, "stale.txt");
    await writeFile(filePath, "old\n", "utf8");
    await writeFile(staleFilePath, "stale\n", "utf8");
    const files: GeneratedFile[] = [
      { path: ".gitignore", content: "new\n" },
      { path: "src/index.ts", content: "export const value = 1;\n" },
    ];

    await writeGeneratedFiles(targetDir, files, { overwrite: true });

    await expect(readFile(filePath, "utf8")).resolves.toBe("new\n");
    await expect(readFile(path.join(targetDir, "src/index.ts"), "utf8")).resolves.toBe("export const value = 1;\n");
    await expect(readFile(staleFilePath, "utf8")).rejects.toThrow();
  });
});
