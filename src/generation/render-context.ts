import { toPascalCase } from '../domain/naming';
import type { ProjectSpec } from '../domain/types';

function createOptionalImportLine(symbol: string | undefined, packageName: string | undefined): string {
  return symbol && packageName ? `import { ${symbol} } from '${packageName}';\n` : '';
}

function createOptionalDependencyDecorator(symbol: string | undefined): string {
  return symbol ? `@DependentOn(${symbol})\n` : '';
}

function createUiDependentOn(spec: ProjectSpec): string {
  const parts = [
    spec.blueprint.baseUiDependencyImport?.pluginSymbol,
    spec.names.logicClassName,
  ].filter(Boolean);

  return `@DependentOn(${parts.join(', ')})\n`;
}

function createBuildEntries(spec: ProjectSpec): string {
  return spec.buildEntries
    .map((entry) => `    ['${entry.key}', '${entry.sourcePath}'],`)
    .join('\n');
}

function createIndexLines(spec: ProjectSpec): string {
  const lines = [
    `export type { ${spec.names.configName} } from './config/config';`,
    spec.blueprint.includeUiPlugin || spec.blueprint.includeMobileEntry
      ? `export type { ${spec.names.uiConfigName} } from './config/ui-config';`
      : undefined,
    `export { ${spec.names.logicClassName} } from './plugin';`,
    spec.blueprint.includeUiPlugin ? `export { ${spec.names.uiClassName} } from './ui-plugin';` : undefined,
    spec.blueprint.includeMobileEntry ? `export { ${spec.names.mobileClassName} } from './mobile-plugin';` : undefined,
    spec.blueprint.includeFacade ? `export { ${spec.names.featurePascal}Facade } from './facade/index';` : undefined,
    spec.blueprint.includeWorkerEntry ? `export { ${spec.names.workerClassName} } from './worker/plugin';` : undefined,
    spec.blueprint.includeWorkerEntry ? `export { ${spec.names.workerChannelConstant} } from './worker/${spec.input.pluginSlug}.worker.service';` : undefined,
  ].filter(Boolean);

  return lines.join('\n');
}

function createReadmeCommands(spec: ProjectSpec): string {
  const commands = [
    'pnpm install',
    'pnpm build',
    'pnpm lint',
    'pnpm test',
  ];

  if (spec.blueprint.includeDemo) {
    commands.push('pnpm dev');
  }

  return commands.join('\n');
}

function createDemoImports(spec: ProjectSpec): string {
  const pluginImportName = spec.blueprint.includeMobileEntry
    ? spec.names.mobileClassName
    : spec.blueprint.includeUiPlugin
      ? spec.names.uiClassName
      : spec.names.logicClassName;
  const localeImport = spec.blueprint.includeLocale ? "import pluginEnUS from '../src/locale/en-US';" : undefined;

  const lines = [
    "import { LocaleType, mergeLocales, Univer, UniverInstanceType } from '@univerjs/core';",
    "import DesignEnUS from '@univerjs/design/locale/en-US';",
    "import UIEnUS from '@univerjs/ui/locale/en-US';",
    "import { UniverRenderEnginePlugin } from '@univerjs/engine-render';",
    "import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';",
    "import { UniverUIPlugin } from '@univerjs/ui';",
    spec.input.surface === 'docs' ? "import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';" : undefined,
    spec.input.surface === 'docs' ? "import { UniverDocsPlugin } from '@univerjs/docs';" : undefined,
    spec.input.surface === 'docs' ? "import { UniverDocsUIPlugin } from '@univerjs/docs-ui';" : undefined,
    spec.input.surface === 'sheets' ? "import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';" : undefined,
    spec.input.surface === 'sheets' ? "import SheetsEnUS from '@univerjs/sheets/locale/en-US';" : undefined,
    spec.input.surface === 'sheets' ? "import SheetsFormulaUIEnUS from '@univerjs/sheets-formula-ui/locale/en-US';" : undefined,
    spec.input.surface === 'sheets' ? "import SheetsNumfmtUIEnUS from '@univerjs/sheets-numfmt-ui/locale/en-US';" : undefined,
    spec.input.surface === 'sheets' ? "import SheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverDocsPlugin } from '@univerjs/docs';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverDocsUIPlugin } from '@univerjs/docs-ui';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverSheetsPlugin } from '@univerjs/sheets';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverSheetsNumfmtUIPlugin } from '@univerjs/sheets-numfmt-ui';" : undefined,
    spec.input.surface === 'sheets' ? "import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';" : undefined,
    spec.input.surface === 'slides' ? "import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';" : undefined,
    spec.input.surface === 'slides' ? "import { UniverDocsPlugin } from '@univerjs/docs';" : undefined,
    spec.input.surface === 'slides' ? "import { UniverDocsUIPlugin } from '@univerjs/docs-ui';" : undefined,
    spec.input.surface === 'slides' ? "import { UniverDrawingPlugin } from '@univerjs/drawing';" : undefined,
    spec.input.surface === 'slides' ? "import { UniverSlidesPlugin } from '@univerjs/slides';" : undefined,
    spec.input.surface === 'slides' ? "import { UniverSlidesUIPlugin } from '@univerjs/slides-ui';" : undefined,
    `import { ${pluginImportName} } from '../src';`,
    localeImport,
    "import '@univerjs/design/lib/index.css';",
    "import '@univerjs/ui/lib/index.css';",
    spec.input.surface === 'docs' ? "import '@univerjs/docs-ui/lib/index.css';" : undefined,
    spec.input.surface === 'sheets' ? "import '@univerjs/docs-ui/lib/index.css';" : undefined,
    spec.input.surface === 'sheets' ? "import '@univerjs/sheets-ui/lib/index.css';" : undefined,
    spec.input.surface === 'sheets' ? "import '@univerjs/sheets-formula-ui/lib/index.css';" : undefined,
    spec.input.surface === 'sheets' ? "import '@univerjs/sheets-numfmt-ui/lib/index.css';" : undefined,
    spec.input.surface === 'slides' ? "import '@univerjs/docs-ui/lib/index.css';" : undefined,
    spec.input.surface === 'slides' ? "import '@univerjs/slides-ui/lib/index.css';" : undefined,
  ].filter(Boolean);

  return lines.join('\n');
}

function createDemoRegistrations(spec: ProjectSpec): string {
  const generatedPluginClass = spec.blueprint.includeMobileEntry
    ? spec.names.mobileClassName
    : spec.blueprint.includeUiPlugin
      ? spec.names.uiClassName
      : spec.names.logicClassName;

  const lines = [
    'const univer = new Univer({',
    '  locale: LocaleType.EN_US,',
    '  locales: {',
    `    [LocaleType.EN_US]: ${createDemoLocaleMergeExpression(spec)},`,
    '  },',
    '});',
    '',
    'univer.registerPlugin(UniverRenderEnginePlugin);',
    'univer.registerPlugin(UniverFormulaEnginePlugin);',
    "univer.registerPlugin(UniverUIPlugin, { container: 'app' });",
    spec.input.surface === 'docs' ? 'univer.registerPlugin(UniverDocsPlugin);' : undefined,
    spec.input.surface === 'docs' ? 'univer.registerPlugin(UniverDocsUIPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverDocsPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverDocsUIPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverSheetsPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverSheetsUIPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverSheetsFormulaPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverSheetsFormulaUIPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverSheetsNumfmtPlugin);' : undefined,
    spec.input.surface === 'sheets' ? 'univer.registerPlugin(UniverSheetsNumfmtUIPlugin);' : undefined,
    spec.input.surface === 'slides' ? 'univer.registerPlugin(UniverDocsPlugin);' : undefined,
    spec.input.surface === 'slides' ? 'univer.registerPlugin(UniverDocsUIPlugin);' : undefined,
    spec.input.surface === 'slides' ? 'univer.registerPlugin(UniverDrawingPlugin);' : undefined,
    spec.input.surface === 'slides' ? 'univer.registerPlugin(UniverSlidesPlugin);' : undefined,
    spec.input.surface === 'slides' ? 'univer.registerPlugin(UniverSlidesUIPlugin);' : undefined,
    `univer.registerPlugin(${generatedPluginClass});`,
    '',
    createDemoUnitLine(spec),
  ].filter(Boolean);

  return lines.join('\n');
}

function createDemoLocaleMergeExpression(spec: ProjectSpec): string {
  const localeModules = [
    'DesignEnUS',
    'UIEnUS',
    spec.input.surface === 'docs' ? 'DocsUIEnUS' : undefined,
    spec.input.surface === 'sheets' ? 'DocsUIEnUS' : undefined,
    spec.input.surface === 'sheets' ? 'SheetsEnUS' : undefined,
    spec.input.surface === 'sheets' ? 'SheetsUIEnUS' : undefined,
    spec.input.surface === 'sheets' ? 'SheetsFormulaUIEnUS' : undefined,
    spec.input.surface === 'sheets' ? 'SheetsNumfmtUIEnUS' : undefined,
    spec.input.surface === 'slides' ? 'DocsUIEnUS' : undefined,
    spec.blueprint.includeLocale ? 'pluginEnUS' : undefined,
  ].filter(Boolean);

  return `mergeLocales(${localeModules.join(', ')})`;
}

function createDemoUnitLine(spec: ProjectSpec): string {
  if (spec.input.surface === 'docs') {
    return 'univer.createUnit(UniverInstanceType.UNIVER_DOC, {});';
  }

  if (spec.input.surface === 'slides') {
    return 'univer.createUnit(UniverInstanceType.UNIVER_SLIDE, {});';
  }

  if (spec.input.surface === 'universal') {
    return '';
  }

  return 'univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});';
}

function createLocaleBody(spec: ProjectSpec): string {
  const lines = [
    `  '${spec.names.logicPluginConstant}': {`,
    `    title: '${toPascalCase(spec.input.pluginSlug)}',`,
    '  },',
  ];

  if (spec.blueprint.includeUiPlugin) {
    lines.push(
      `  '${spec.names.uiPluginConstant}': {`,
      `    title: '${toPascalCase(spec.input.pluginSlug)} UI',`,
      '  },'
    );
  }

  return lines.join('\n');
}

export function createRenderContext(spec: ProjectSpec): Record<string, string> {
  return {
    BUILD_ENTRIES: createBuildEntries(spec),
    CONFIG_INTERFACE: spec.names.configName,
    CONFIG_KEY: `${spec.names.featureConstant}_PLUGIN_CONFIG_KEY`,
    CONTROLLER_CLASS: `${spec.names.featurePascal}Controller`,
    DEMO_IMPORTS: createDemoImports(spec),
    DEMO_REGISTRATIONS: createDemoRegistrations(spec),
    FACADE_CLASS: `${spec.names.featurePascal}Facade`,
    FEATURE_PASCAL: spec.names.featurePascal,
    FEATURE_SLUG: spec.input.pluginSlug,
    FEATURE_TITLE: toPascalCase(spec.input.pluginSlug),
    INDEX_EXPORT_LINES: createIndexLines(spec),
    INSTANCE_TYPE: spec.names.instanceType,
    LOGIC_CLASS: spec.names.logicClassName,
    LOGIC_DEPENDENCY_DECORATOR_IMPORT: spec.blueprint.baseLogicDependencyImport ? '  DependentOn,\n' : '',
    LOGIC_DEPENDENCY_DECORATOR: createOptionalDependencyDecorator(spec.blueprint.baseLogicDependencyImport?.pluginSymbol),
    LOGIC_DEPENDENCY_IMPORT: createOptionalImportLine(
      spec.blueprint.baseLogicDependencyImport?.pluginSymbol,
      spec.blueprint.baseLogicDependencyImport?.packageName
    ),
    LOGIC_PLUGIN_CONSTANT: spec.names.logicPluginConstant,
    LOCALE_BODY: createLocaleBody(spec),
    MOBILE_CLASS: spec.names.mobileClassName,
    MOBILE_PLUGIN_CONSTANT: spec.names.mobilePluginConstant,
    PACKAGE_NAME: spec.blueprint.packageName,
    README_COMMANDS: createReadmeCommands(spec),
    README_SHAPE: spec.input.shape,
    README_SURFACE: spec.input.surface,
    README_VERSION: spec.input.univerVersion,
    SERVICE_CLASS: `${spec.names.featurePascal}Service`,
    TEST_PLUGIN_CLASS: spec.names.logicClassName,
    TEST_PLUGIN_CONSTANT: spec.names.logicPluginConstant,
    UI_CLASS: spec.names.uiClassName,
    UI_CONFIG_INTERFACE: spec.names.uiConfigName,
    UI_CONFIG_KEY: `${spec.names.featureConstant}_UI_PLUGIN_CONFIG_KEY`,
    UI_DEPENDENCY_IMPORT: createOptionalImportLine(
      spec.blueprint.baseUiDependencyImport?.pluginSymbol,
      spec.blueprint.baseUiDependencyImport?.packageName
    ),
    UI_DEPENDENT_ON_DECORATOR: createUiDependentOn(spec),
    UI_PLUGIN_CONSTANT: spec.names.uiPluginConstant,
    WORKER_CHANNEL_CONSTANT: spec.names.workerChannelConstant,
    WORKER_CLASS: spec.names.workerClassName,
    WORKER_PLUGIN_CONSTANT: spec.names.workerPluginConstant,
  };
}
