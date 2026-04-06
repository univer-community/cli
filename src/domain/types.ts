export const SURFACES = ['sheets', 'docs', 'slides', 'universal'] as const;
export const SHAPES = ['logic-only', 'logic-ui', 'mobile-ui-addon', 'worker-rpc-companion'] as const;

export type Surface = (typeof SURFACES)[number];
export type Shape = (typeof SHAPES)[number];

export interface GenerationOptions {
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

export interface Choice<T extends string> {
  label: string;
  value: T;
  hint?: string;
}

export interface DependencyImport {
  packageName: string;
  pluginSymbol: string;
}

export interface ProjectBlueprint {
  packageName: string;
  packageDirectoryName: string;
  includeUiPlugin: boolean;
  includeMobileEntry: boolean;
  includeWorkerEntry: boolean;
  includeFacade: boolean;
  includeLocale: boolean;
  includeDemo: boolean;
  baseLogicDependencyImport?: DependencyImport;
  baseUiDependencyImport?: DependencyImport;
}

export interface BuildEntry {
  key: string;
  sourcePath: string;
}

export interface PublishExportTarget {
  import: string;
  require: string;
  types: string;
}

export type PublishExport = PublishExportTarget | string;

export interface ProjectNames {
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

export interface ProjectDependencies {
  runtime: Record<string, string>;
  peer: Record<string, string>;
  dev: Record<string, string>;
}

export interface ProjectScripts {
  build: string;
  buildBundle: string;
  buildTypes: string;
  buildDemo?: string;
  coverage: string;
  devDemo?: string;
  lint: string;
  lintFix: string;
  test: string;
  typecheck: string;
}

export interface ProjectExports {
  source: Record<string, string>;
  publish: Record<string, PublishExport>;
}

export interface ProjectSpec {
  input: GenerationOptions;
  blueprint: ProjectBlueprint;
  names: ProjectNames;
  buildEntries: BuildEntry[];
  dependencies: ProjectDependencies;
  scripts: ProjectScripts;
  exports: ProjectExports;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface WriteGeneratedFilesOptions {
  overwrite?: boolean;
}
