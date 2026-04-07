import path from "node:path";
import process from "node:process";
import { collectGenerationOptions, confirmOverwriteExistingFiles, createPromptSession } from "./prompt";
import { findExistingGeneratedFiles, generateProjectFiles, writeGeneratedFiles } from "./project-generator";

function printHelp(): void {
  process.stdout.write(`create-univer-plugin

Usage:
  create-univer-plugin [target-dir]

Options:
  --help       Show help
  --version    Show version
  --overwrite  Clear target directory before generating without prompting
`);
}

export async function runCli(argv = process.argv.slice(2)): Promise<void> {
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  if (argv.includes("--version") || argv.includes("-v")) {
    process.stdout.write("0.1.0\n");
    return;
  }

  const overwriteRequested = argv.includes("--overwrite");
  const [initialTargetDir] = argv.filter((argument) => !argument.startsWith("-"));
  const promptSession = createPromptSession();

  try {
    const options = await collectGenerationOptions(initialTargetDir, promptSession);
    const files = generateProjectFiles(options);
    const targetDir = path.resolve(options.targetDir);
    const existingFiles = findExistingGeneratedFiles(targetDir, files);
    const shouldOverwrite =
      overwriteRequested ||
      (existingFiles.length > 0 && (await confirmOverwriteExistingFiles(targetDir, existingFiles, promptSession)));

    if (existingFiles.length > 0 && !shouldOverwrite) {
      throw new Error("Generation cancelled because clearing the target directory was declined.");
    }

    await writeGeneratedFiles(targetDir, files, { overwrite: shouldOverwrite });

    process.stdout.write(`Generated ${files.length} files in ${targetDir}\n`);
  } finally {
    promptSession.close();
  }
}
