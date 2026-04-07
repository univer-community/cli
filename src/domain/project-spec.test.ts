import { describe, expect, it } from "vitest";
import { ensureKebabCase, toConstantCase, toPascalCase } from "./naming";
import { deriveProjectBlueprint, deriveProjectNames, deriveProjectSpec } from "./project-spec";
import type { IGenerationOptions } from "./types";

const baseOptions: IGenerationOptions = {
  targetDir: "./tmp",
  pluginSlug: "smart-filter",
  packageName: "@univerjs/univer-smart-filter-plugin",
  univerVersion: "0.19.0",
  projectVersion: "0.1.0",
  surface: "sheets",
  shape: "logic-ui",
  includeFacade: true,
  includeLocale: true,
  includeDemo: false,
};

describe("project spec", () => {
  it("normalizes naming helpers", () => {
    expect(ensureKebabCase("Smart Filter")).toBe("smart-filter");
    expect(toPascalCase("smart-filter")).toBe("SmartFilter");
    expect(toConstantCase("smart-filter")).toBe("SMART_FILTER");
  });

  it("derives the blueprint for a single-package ui plugin", () => {
    const blueprint = deriveProjectBlueprint(baseOptions);

    expect(blueprint.packageName).toBe("@univerjs/univer-smart-filter-plugin");
    expect(blueprint.packageDirectoryName).toBe("univer-smart-filter-plugin");
    expect(blueprint.includeUiPlugin).toBe(true);
    expect(blueprint.includeMobileEntry).toBe(false);
  });

  it("derives names, build entries, and dependency groups", () => {
    const names = deriveProjectNames(baseOptions);
    const spec = deriveProjectSpec(baseOptions);

    expect(names.logicPluginConstant).toBe("SHEETS_SMART_FILTER_PLUGIN");
    expect(names.uiPluginConstant).toBe("SHEETS_SMART_FILTER_UI_PLUGIN");
    expect(spec.buildEntries.map((entry) => entry.key)).toEqual([
      "index",
      "plugin",
      "ui-plugin",
      "facade",
      "locale/en-US",
    ]);
    expect(spec.dependencies.runtime).toMatchObject({
      "@univerjs/core": "^0.19.0",
      "@univerjs/sheets": "^0.19.0",
      "@univerjs/sheets-ui": "^0.19.0",
    });
    expect(spec.metadata.description).toBe("A Univer Sheets plugin for Smart Filter.");
    expect(spec.metadata.homepage).toBe("https://github.com/univer-community");
    expect(spec.metadata.author).toBe("Anonymous");
    expect(spec.metadata.license).toBe("MIT");
    expect(spec.metadata.keywords).toEqual(["univer", "plugin", "sheets", "smart", "filter"]);
  });
});
