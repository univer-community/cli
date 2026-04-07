import process from "node:process";
import { createInterface } from "node:readline/promises";
import path from "node:path";
import {
  DEFAULT_PACKAGE_NAME,
  DEFAULT_PROJECT_VERSION,
  DEFAULT_UNIVER_VERSION,
  SHAPE_CHOICES,
  SURFACE_CHOICES,
} from "../constants";
import { ensureKebabCase } from "../domain/naming";
import type { Choice, GenerationOptions } from "../domain/types";

export interface PromptSession {
  question(prompt: string): Promise<string>;
  close(): void;
}

export function createPromptSession(): PromptSession {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function askInput(
  rl: PromptSession,
  message: string,
  defaultValue?: string,
  validate?: (value: string) => string | null,
): Promise<string> {
  while (true) {
    const suffix = defaultValue ? ` [${defaultValue}]` : "";
    const answer = (await rl.question(`${message}${suffix}: `)).trim();
    const value = answer || defaultValue || "";
    const error = validate ? validate(value) : null;

    if (!error) {
      return value;
    }

    process.stdout.write(`${error}\n`);
  }
}

async function askConfirm(rl: PromptSession, message: string, defaultValue: boolean): Promise<boolean> {
  const label = defaultValue ? "Y/n" : "y/N";

  while (true) {
    const answer = (await rl.question(`${message} [${label}]: `)).trim().toLowerCase();
    if (!answer) {
      return defaultValue;
    }
    if (["y", "yes"].includes(answer)) {
      return true;
    }
    if (["n", "no"].includes(answer)) {
      return false;
    }

    process.stdout.write("Please answer with y or n.\n");
  }
}

async function askChoice<T extends string>(rl: PromptSession, message: string, choices: Choice<T>[]): Promise<T> {
  process.stdout.write(`${message}\n`);
  choices.forEach((choice, index) => {
    const hint = choice.hint ? ` - ${choice.hint}` : "";
    process.stdout.write(`  ${index + 1}. ${choice.label}${hint}\n`);
  });

  while (true) {
    const answer = (await rl.question("Choose a number: ")).trim();
    const index = Number(answer);
    if (Number.isInteger(index) && index >= 1 && index <= choices.length) {
      return choices[index - 1].value;
    }

    process.stdout.write(`Please enter a number between 1 and ${choices.length}.\n`);
  }
}

function validateDirectory(value: string): string | null {
  return value.trim() ? null : "Output directory cannot be empty.";
}

function validateVersion(value: string): string | null {
  return /^\d+\.\d+\.\d+(-[\w.-]+)?$/.test(value) ? null : "Please enter a semver-like version such as 0.19.0.";
}

function validatePackageName(value: string): string | null {
  if (!value.trim()) {
    return "Package name cannot be empty.";
  }

  if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(value.trim())) {
    return "Package name should look like @univerjs/univer-sample-plugin or univer-sample-plugin.";
  }

  return null;
}

export async function collectGenerationOptions(
  initialTargetDir?: string,
  promptSession?: PromptSession,
): Promise<GenerationOptions> {
  const rl = promptSession ?? createPromptSession();
  const ownsSession = !promptSession;

  try {
    const targetDir = await askInput(
      rl,
      "Output directory",
      initialTargetDir ?? "./univer-plugin-project",
      validateDirectory,
    );
    const pluginSlug = ensureKebabCase(
      await askInput(rl, "Feature name (kebab-case)", "sample-feature", (value) => {
        try {
          ensureKebabCase(value);
          return null;
        } catch (error) {
          return error instanceof Error ? error.message : "Invalid feature name.";
        }
      }),
    );
    const packageName = await askInput(rl, "Package name", DEFAULT_PACKAGE_NAME, validatePackageName);
    const univerVersion = await askInput(rl, "Target Univer version", DEFAULT_UNIVER_VERSION, validateVersion);
    const surface = await askChoice(rl, "Select a surface:", SURFACE_CHOICES);
    const shape = await askChoice(rl, "Select a package shape:", SHAPE_CHOICES);
    const includeFacade = await askConfirm(rl, "Include a facade entry?", false);
    const includeLocale = await askConfirm(rl, "Include a locale entry?", false);
    const includeDemo = await askConfirm(rl, "Include a demo app?", false);

    return {
      targetDir,
      pluginSlug,
      packageName,
      univerVersion,
      projectVersion: DEFAULT_PROJECT_VERSION,
      surface,
      shape,
      includeFacade,
      includeLocale,
      includeDemo,
    };
  } finally {
    if (ownsSession) {
      rl.close();
    }
  }
}

export async function confirmOverwriteExistingFiles(
  targetDir: string,
  existingFiles: string[],
  promptSession?: PromptSession,
): Promise<boolean> {
  const rl = promptSession ?? createPromptSession();
  const ownsSession = !promptSession;

  try {
    const preview = existingFiles
      .slice(0, 5)
      .map((filePath) => `  - ${path.relative(targetDir, filePath) || path.basename(filePath)}`)
      .join("\n");
    const suffix = existingFiles.length > 5 ? `\n  ...and ${existingFiles.length - 5} more` : "";

    process.stdout.write(
      `Found ${existingFiles.length} existing generated file(s) in ${targetDir}:\n${preview}${suffix}\n`,
    );

    return askConfirm(rl, "Clear the target directory and recreate the project?", false);
  } finally {
    if (ownsSession) {
      rl.close();
    }
  }
}
