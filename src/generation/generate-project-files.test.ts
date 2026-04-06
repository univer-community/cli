import { describe, expect, it } from 'vitest';
import { deriveProjectSpec } from '../domain/project-spec';
import { generateProjectFiles, renderProjectFiles } from './generate-project-files';

function getFile(files: ReturnType<typeof generateProjectFiles>, filePath: string): string {
  const file = files.find((entry) => entry.path === filePath);
  if (!file) {
    throw new Error(`Missing generated file: ${filePath}`);
  }

  return file.content;
}

describe('generation pipeline', () => {
  it('renders files from templates and omits monorepo-only conventions', () => {
    const files = generateProjectFiles({
      targetDir: './tmp/standalone',
      pluginSlug: 'smart-filter',
      packageName: '@univerjs/univer-smart-filter-plugin',
      univerVersion: '0.19.0',
      projectVersion: '0.1.0',
      surface: 'sheets',
      shape: 'logic-ui',
      includeFacade: true,
      includeLocale: true,
      includeDemo: true,
    });

    const joined = files.map((file) => file.content).join('\n');

    expect(joined).not.toContain('workspace:*');
    expect(joined).not.toContain('@univerjs-infra/shared');
    expect(getFile(files, 'package.json')).toContain('"name": "@univerjs/univer-smart-filter-plugin"');
    expect(getFile(files, 'package.json')).toContain('"license": "MIT"');
    expect(getFile(files, 'package.json')).toContain('"rxjs": "^7.8.2"');
    expect(getFile(files, 'package.json')).toContain('"oxlint": "^1.58.0"');
    expect(getFile(files, 'package.json')).toContain('"@univerjs/design": "^0.19.0"');
    expect(getFile(files, 'package.json')).toContain('"lint": "oxlint --config .oxlintrc.json ."');
    expect(getFile(files, '.editorconfig')).toContain('indent_size = 2');
    expect(getFile(files, '.oxlintrc.json')).toContain('"demo-dist/**"');
    expect(getFile(files, 'README.md')).toContain('## Usage');
    expect(getFile(files, 'README.md')).toContain('## Development');
    expect(getFile(files, 'package.json')).toContain('"./lib/*": "./lib/*"');
    expect(getFile(files, 'package.json')).toContain('"./lib/facade"');
    expect(getFile(files, 'scripts/build.ts')).toContain("import { build as tsdownBuild } from 'tsdown';");
    expect(getFile(files, 'scripts/build.ts')).toContain("const [command, ...args] = process.argv.slice(2);");
    expect(getFile(files, 'src/globals.d.ts')).toContain("declare module '*.css';");
    expect(getFile(files, 'src/index.ts')).not.toContain(".js'");
    expect(getFile(files, 'src/plugin.ts')).toContain('export class UniverSheetsSmartFilterPlugin extends Plugin');
    expect(getFile(files, 'demo/main.ts')).not.toContain(".js'");
    expect(getFile(files, 'demo/main.ts')).toContain('univer.registerPlugin(UniverSheetsUIPlugin);');
    expect(getFile(files, 'demo/main.ts')).toContain('univer.registerPlugin(UniverSheetsSmartFilterUIPlugin);');
    expect(getFile(files, 'demo/main.ts')).not.toContain('univer.registerPlugin(UniverSheetsSmartFilterPlugin);');
    expect(getFile(files, 'demo/main.ts')).toContain("import '@univerjs/design/lib/index.css';");
    expect(getFile(files, 'demo/main.ts')).toContain('univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});');
  });

  it('uses the template plan to add optional mobile files', () => {
    const spec = deriveProjectSpec({
      targetDir: './tmp/mobile',
      pluginSlug: 'smart-filter',
      packageName: '@univerjs/univer-smart-filter-plugin',
      univerVersion: '0.19.0',
      projectVersion: '0.1.0',
      surface: 'docs',
      shape: 'mobile-ui-addon',
      includeFacade: false,
      includeLocale: true,
      includeDemo: false,
    });
    const files = renderProjectFiles(spec);

    expect(getFile(files, 'src/mobile-plugin.ts')).toContain('UniverDocsSmartFilterMobileUIPlugin');
    expect(getFile(files, 'src/ui-plugin.ts')).toContain('UniverDocsSmartFilterUIPlugin');
    expect(getFile(files, 'package.json')).toContain('"./mobile-plugin": "./src/mobile-plugin.ts"');
  });

  it('renders worker companion files when requested', () => {
    const files = generateProjectFiles({
      targetDir: './tmp/worker',
      pluginSlug: 'remote-eval',
      packageName: '@univerjs/univer-remote-eval-plugin',
      univerVersion: '0.19.0',
      projectVersion: '0.1.0',
      surface: 'universal',
      shape: 'worker-rpc-companion',
      includeFacade: false,
      includeLocale: false,
      includeDemo: false,
    });

    expect(getFile(files, 'src/worker/plugin.ts')).toContain('UniverRemoteEvalWorkerPlugin');
    expect(getFile(files, 'src/worker/remote-eval.worker.service.ts')).toContain('REMOTE_EVAL_WORKER_CHANNEL');
  });
});
