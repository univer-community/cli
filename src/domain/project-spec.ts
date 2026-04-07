import { ensureKebabCase, getInstanceType, getSurfacePrefix, toConstantCase, toPascalCase } from "./naming";
import type {
  IBuildEntry,
  IDependencyImport,
  IGenerationOptions,
  IProjectBlueprint,
  IProjectDependencies,
  IProjectExports,
  IProjectMetadata,
  IProjectNames,
  PublishExport,
  IPublishExportTarget,
  IProjectScripts,
  IProjectSpec,
  Surface,
} from "./types";

const BASE_LOGIC_DEPENDENCY: Record<Exclude<Surface, "universal">, IDependencyImport> = {
  sheets: {
    packageName: "@univerjs/sheets",
    pluginSymbol: "UniverSheetsPlugin",
  },
  docs: {
    packageName: "@univerjs/docs",
    pluginSymbol: "UniverDocsPlugin",
  },
  slides: {
    packageName: "@univerjs/slides",
    pluginSymbol: "UniverSlidesPlugin",
  },
};

const BASE_UI_DEPENDENCY: Record<Surface, IDependencyImport> = {
  sheets: {
    packageName: "@univerjs/sheets-ui",
    pluginSymbol: "UniverSheetsUIPlugin",
  },
  docs: {
    packageName: "@univerjs/docs-ui",
    pluginSymbol: "UniverDocsUIPlugin",
  },
  slides: {
    packageName: "@univerjs/slides-ui",
    pluginSymbol: "UniverSlidesUIPlugin",
  },
  universal: {
    packageName: "@univerjs/ui",
    pluginSymbol: "UniverUIPlugin",
  },
};

const COMMUNITY_HOMEPAGE = "https://github.com/univer-community";
const COMMUNITY_AUTHOR = "Anonymous";
const COMMUNITY_LICENSE = "MIT";

function normalizePackageName(packageName: string): string {
  const trimmed = packageName.trim();
  if (!trimmed) {
    throw new Error("Package name cannot be empty.");
  }

  return trimmed;
}

function getPackageDirectoryName(packageName: string): string {
  const normalized = normalizePackageName(packageName);
  const slashIndex = normalized.lastIndexOf("/");
  return slashIndex === -1 ? normalized : normalized.slice(slashIndex + 1);
}

function createPluginConstant(surface: Surface, pluginSlug: string, suffix: string): string {
  const base =
    surface === "universal"
      ? `${toConstantCase(pluginSlug)}${suffix}`
      : `${toConstantCase(surface)}_${toConstantCase(pluginSlug)}${suffix}`;

  return base.replace(/__+/g, "_");
}

function createClassName(surface: Surface, pluginSlug: string, suffix: string): string {
  return `Univer${getSurfacePrefix(surface)}${toPascalCase(pluginSlug)}${suffix}`;
}

function getSemverRange(version: string): string {
  return `^${version}`;
}

function toTitleWords(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function createDescription(input: IGenerationOptions): string {
  const title = toTitleWords(input.pluginSlug);

  if (input.surface === "universal") {
    return `A Univer plugin for ${title}.`;
  }

  return `A Univer ${toTitleWords(input.surface)} plugin for ${title}.`;
}

function createKeywords(input: IGenerationOptions): string[] {
  return Array.from(
    new Set([
      "univer",
      "plugin",
      ...(input.surface === "universal" ? [] : [input.surface]),
      ...input.pluginSlug.split("-").filter(Boolean),
    ]),
  );
}

export function deriveProjectBlueprint(input: IGenerationOptions): IProjectBlueprint {
  return {
    packageName: normalizePackageName(input.packageName),
    packageDirectoryName: getPackageDirectoryName(input.packageName),
    includeUiPlugin: input.shape === "logic-ui" || input.shape === "mobile-ui-addon",
    includeMobileEntry: input.shape === "mobile-ui-addon",
    includeWorkerEntry: input.shape === "worker-rpc-companion",
    includeFacade: input.includeFacade,
    includeLocale: input.includeLocale,
    includeDemo: input.includeDemo,
    baseLogicDependencyImport: input.surface === "universal" ? undefined : BASE_LOGIC_DEPENDENCY[input.surface],
    baseUiDependencyImport:
      input.shape === "logic-ui" || input.shape === "mobile-ui-addon" ? BASE_UI_DEPENDENCY[input.surface] : undefined,
  };
}

function deriveProjectNamesInternal(input: IGenerationOptions): IProjectNames {
  const featurePascal = toPascalCase(input.pluginSlug);
  const featureConstant = toConstantCase(input.pluginSlug);
  const surfacePrefix = getSurfacePrefix(input.surface);

  return {
    featurePascal,
    featureConstant,
    surfacePrefix,
    instanceType: getInstanceType(input.surface),
    logicClassName: createClassName(input.surface, input.pluginSlug, "Plugin"),
    uiClassName: createClassName(input.surface, input.pluginSlug, "UIPlugin"),
    mobileClassName: createClassName(input.surface, input.pluginSlug, "MobileUIPlugin"),
    workerClassName: createClassName(input.surface, input.pluginSlug, "WorkerPlugin"),
    logicPluginConstant: createPluginConstant(input.surface, input.pluginSlug, "_PLUGIN"),
    uiPluginConstant: createPluginConstant(input.surface, input.pluginSlug, "_UI_PLUGIN"),
    mobilePluginConstant: createPluginConstant(input.surface, input.pluginSlug, "_MOBILE_UI_PLUGIN"),
    workerPluginConstant: createPluginConstant(input.surface, input.pluginSlug, "_WORKER_PLUGIN"),
    configName: `IUniver${surfacePrefix}${featurePascal}Config`,
    uiConfigName: `IUniver${surfacePrefix}${featurePascal}UIConfig`,
    workerChannelConstant: `${ensureKebabCase(input.pluginSlug).replace(/-/g, "_").toUpperCase()}_WORKER_CHANNEL`,
  };
}

function deriveBuildEntries(blueprint: IProjectBlueprint): IBuildEntry[] {
  const entries: IBuildEntry[] = [
    { key: "index", sourcePath: "src/index.ts" },
    { key: "plugin", sourcePath: "src/plugin.ts" },
  ];

  if (blueprint.includeUiPlugin) {
    entries.push({ key: "ui-plugin", sourcePath: "src/ui-plugin.ts" });
  }
  if (blueprint.includeMobileEntry) {
    entries.push({ key: "mobile-plugin", sourcePath: "src/mobile-plugin.ts" });
  }
  if (blueprint.includeWorkerEntry) {
    entries.push({ key: "worker/plugin", sourcePath: "src/worker/plugin.ts" });
  }
  if (blueprint.includeFacade) {
    entries.push({ key: "facade", sourcePath: "src/facade/index.ts" });
  }
  if (blueprint.includeLocale) {
    entries.push({ key: "locale/en-US", sourcePath: "src/locale/en-US.ts" });
  }

  return entries;
}

function deriveDependencies(input: IGenerationOptions, blueprint: IProjectBlueprint): IProjectDependencies {
  const runtime: Record<string, string> = {
    "@univerjs/core": getSemverRange(input.univerVersion),
    rxjs: "^7.8.2",
  };

  if (blueprint.baseLogicDependencyImport) {
    runtime[blueprint.baseLogicDependencyImport.packageName] = getSemverRange(input.univerVersion);
  }
  if (blueprint.baseUiDependencyImport) {
    runtime[blueprint.baseUiDependencyImport.packageName] = getSemverRange(input.univerVersion);
  }
  if (blueprint.includeWorkerEntry) {
    runtime["@univerjs/rpc"] = getSemverRange(input.univerVersion);
  }
  const peer: Record<string, string> =
    blueprint.includeUiPlugin || blueprint.includeMobileEntry
      ? {
          react: "^18.0.0 || ^19.0.0",
          "react-dom": "^18.0.0 || ^19.0.0",
        }
      : {};

  const dev: Record<string, string> = {
    "@types/node": "^25.5.2",
    oxfmt: "^0.44.0",
    oxlint: "^1.59.0",
    "simple-git-hooks": "^2.13.1",
    tsdown: "^0.21.7",
    tsx: "^4.21.0",
    typescript: "^6.0.2",
    vitest: "^4.1.2",
  };

  if (blueprint.includeDemo) {
    dev["@univerjs/design"] = getSemverRange(input.univerVersion);
    dev["@univerjs/engine-formula"] = getSemverRange(input.univerVersion);
    dev["@univerjs/engine-render"] = getSemverRange(input.univerVersion);
    dev["@univerjs/ui"] = getSemverRange(input.univerVersion);
    dev.vite = "^8.0.4";

    if (input.surface === "docs" && !runtime["@univerjs/docs-ui"]) {
      dev["@univerjs/docs-ui"] = getSemverRange(input.univerVersion);
    }

    if (input.surface === "sheets") {
      dev["@univerjs/docs"] = getSemverRange(input.univerVersion);
      dev["@univerjs/docs-ui"] = getSemverRange(input.univerVersion);
      dev["@univerjs/sheets-formula"] = getSemverRange(input.univerVersion);
      dev["@univerjs/sheets-formula-ui"] = getSemverRange(input.univerVersion);
      dev["@univerjs/sheets-numfmt"] = getSemverRange(input.univerVersion);
      dev["@univerjs/sheets-numfmt-ui"] = getSemverRange(input.univerVersion);
    }

    if (input.surface === "slides") {
      dev["@univerjs/docs"] = getSemverRange(input.univerVersion);
      dev["@univerjs/docs-ui"] = getSemverRange(input.univerVersion);
      dev["@univerjs/drawing"] = getSemverRange(input.univerVersion);
      if (!runtime["@univerjs/slides-ui"]) {
        dev["@univerjs/slides-ui"] = getSemverRange(input.univerVersion);
      }
    }
  }
  if (blueprint.includeUiPlugin || blueprint.includeMobileEntry) {
    dev.react = "^19.2.4";
    dev["react-dom"] = "^19.2.4";
  }

  for (const packageName of Object.keys(runtime)) {
    delete dev[packageName];
  }

  return { runtime, peer, dev };
}

function deriveMetadata(input: IGenerationOptions): IProjectMetadata {
  return {
    author: COMMUNITY_AUTHOR,
    description: createDescription(input),
    homepage: COMMUNITY_HOMEPAGE,
    keywords: createKeywords(input),
    license: COMMUNITY_LICENSE,
  };
}

function deriveScripts(blueprint: IProjectBlueprint): IProjectScripts {
  return {
    build: "pnpm run build:bundle && pnpm run build:types",
    buildBundle: "node ./scripts/build.mjs build --cleanup",
    buildTypes: "tsc -p tsconfig.node.json",
    buildDemo: blueprint.includeDemo ? "vite build --config vite.demo.config.ts" : undefined,
    coverage: "vitest run --coverage",
    devDemo: blueprint.includeDemo ? "vite --config vite.demo.config.ts" : undefined,
    fmt: "oxfmt",
    fmtCheck: "oxfmt --check",
    lint: "oxlint",
    lintFix: "oxlint --fix",
    prepare: "simple-git-hooks",
    test: "vitest run",
    typecheck: "tsc --noEmit",
  };
}

function createPublishTarget(key: string): IPublishExportTarget {
  if (key === "facade") {
    return {
      import: "./lib/es/facade.js",
      require: "./lib/cjs/facade.js",
      types: "./lib/types/facade/index.d.ts",
    };
  }

  if (key === "index") {
    return {
      import: "./lib/es/index.js",
      require: "./lib/cjs/index.js",
      types: "./lib/types/index.d.ts",
    };
  }

  return {
    import: `./lib/es/${key}.js`,
    require: `./lib/cjs/${key}.js`,
    types: `./lib/types/${key}.d.ts`,
  };
}

function deriveExports(blueprint: IProjectBlueprint): IProjectExports {
  const source: Record<string, string> = {
    ".": "./src/index.ts",
    "./*": "./src/*",
  };
  const publish: Record<string, PublishExport> = {
    ".": createPublishTarget("index"),
    "./*": {
      import: "./lib/es/*",
      require: "./lib/cjs/*",
      types: "./lib/types/index.d.ts",
    },
  };

  if (blueprint.includeFacade) {
    source["./facade"] = "./src/facade/index.ts";
    publish["./facade"] = createPublishTarget("facade");
    publish["./lib/facade"] = createPublishTarget("facade");
  }
  if (blueprint.includeLocale) {
    source["./locale/*"] = "./src/locale/*.ts";
    publish["./locale/*"] = {
      import: "./lib/es/locale/*.js",
      require: "./lib/cjs/locale/*.js",
      types: "./lib/types/locale/*.d.ts",
    };
  }
  if (blueprint.includeMobileEntry) {
    source["./mobile-plugin"] = "./src/mobile-plugin.ts";
    publish["./mobile-plugin"] = createPublishTarget("mobile-plugin");
  }
  if (blueprint.includeWorkerEntry) {
    source["./worker/*"] = "./src/worker/*.ts";
    publish["./worker/*"] = {
      import: "./lib/es/worker/*.js",
      require: "./lib/cjs/worker/*.js",
      types: "./lib/types/worker/*.d.ts",
    };
  }

  publish["./lib/*"] = "./lib/*";

  return { source, publish };
}

export function deriveProjectSpec(input: IGenerationOptions): IProjectSpec {
  const normalizedInput: IGenerationOptions = {
    ...input,
    pluginSlug: ensureKebabCase(input.pluginSlug),
    packageName: normalizePackageName(input.packageName),
  };
  const blueprint = deriveProjectBlueprint(normalizedInput);

  return {
    input: normalizedInput,
    blueprint,
    names: deriveProjectNamesInternal(normalizedInput),
    metadata: deriveMetadata(normalizedInput),
    buildEntries: deriveBuildEntries(blueprint),
    dependencies: deriveDependencies(normalizedInput, blueprint),
    scripts: deriveScripts(blueprint),
    exports: deriveExports(blueprint),
  };
}

export function deriveProjectNames(input: IGenerationOptions) {
  const spec = deriveProjectSpec(input);

  return {
    blueprint: spec.blueprint,
    ...spec.names,
  };
}
