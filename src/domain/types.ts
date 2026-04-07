export const SURFACES = ["sheets", "docs", "slides", "universal"] as const;
export const SHAPES = ["logic-only", "logic-ui", "mobile-ui-addon", "worker-rpc-companion"] as const;

export type Surface = (typeof SURFACES)[number];
export type Shape = (typeof SHAPES)[number];

export interface IGenerationOptions {
  targetDir: string;
  pluginSlug: string;
  packageName: string;
  univerVersion: string;
  projectVersion: string;
  surface: Surface;
  shape: Shape;
  includeFacade: boolean;
  includeLocale: boolean;
  includeDemo: boolean;
}

export interface IChoice<T extends string> {
  label: string;
  value: T;
  hint?: string;
}

export interface IDependencyImport {
  packageName: string;
  pluginSymbol: string;
}

export interface IProjectBlueprint {
  packageName: string;
  packageDirectoryName: string;
  includeUiPlugin: boolean;
  includeMobileEntry: boolean;
  includeWorkerEntry: boolean;
  includeFacade: boolean;
  includeLocale: boolean;
  includeDemo: boolean;
  baseLogicDependencyImport?: IDependencyImport;
  baseUiDependencyImport?: IDependencyImport;
}

export interface IBuildEntry {
  key: string;
  sourcePath: string;
}

export interface IPublishExportTarget {
  import: string;
  require: string;
  types: string;
}

export type PublishExport = IPublishExportTarget | string;

export interface IProjectNames {
  featurePascal: string;
  featureConstant: string;
  surfacePrefix: string;
  instanceType: string;
  logicClassName: string;
  uiClassName: string;
  mobileClassName: string;
  workerClassName: string;
  logicPluginConstant: string;
  uiPluginConstant: string;
  mobilePluginConstant: string;
  workerPluginConstant: string;
  configName: string;
  uiConfigName: string;
  workerChannelConstant: string;
}

export interface IProjectDependencies {
  runtime: Record<string, string>;
  peer: Record<string, string>;
  dev: Record<string, string>;
}

export interface IProjectMetadata {
  author: string;
  description: string;
  homepage: string;
  keywords: string[];
  license: string;
}

export interface IProjectScripts {
  build: string;
  buildBundle: string;
  buildTypes: string;
  buildDemo?: string;
  coverage: string;
  devDemo?: string;
  fmt: string;
  fmtCheck: string;
  lint: string;
  lintFix: string;
  prepare: string;
  test: string;
  typecheck: string;
}

export interface IProjectExports {
  source: Record<string, string>;
  publish: Record<string, PublishExport>;
}

export interface IProjectSpec {
  input: IGenerationOptions;
  blueprint: IProjectBlueprint;
  names: IProjectNames;
  metadata: IProjectMetadata;
  buildEntries: IBuildEntry[];
  dependencies: IProjectDependencies;
  scripts: IProjectScripts;
  exports: IProjectExports;
}

export interface IGeneratedFile {
  path: string;
  content: string;
}

export interface IWriteGeneratedFilesOptions {
  overwrite?: boolean;
}
