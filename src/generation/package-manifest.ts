import type { ProjectSpec } from '../domain/types';
import { sortObject, stringifyJson } from './utils';

export function createPackageManifest(spec: ProjectSpec): string {
  return stringifyJson({
    name: spec.blueprint.packageName,
    version: spec.input.projectVersion,
    type: 'module',
    license: 'MIT',
    main: './src/index.ts',
    types: './lib/types/index.d.ts',
    exports: spec.exports.source,
    publishConfig: {
      access: 'public',
      main: './lib/es/index.js',
      module: './lib/es/index.js',
      exports: spec.exports.publish,
    },
    files: ['lib'],
    directories: {
      lib: 'lib',
    },
    scripts: sortObject({
      build: spec.scripts.build,
      'build:bundle': spec.scripts.buildBundle,
      'build:demo': spec.scripts.buildDemo,
      'build:types': spec.scripts.buildTypes,
      coverage: spec.scripts.coverage,
      'dev': spec.scripts.devDemo,
      lint: spec.scripts.lint,
      'lint:fix': spec.scripts.lintFix,
      test: spec.scripts.test,
      typecheck: spec.scripts.typecheck,
    }),
    dependencies: sortObject(spec.dependencies.runtime),
    peerDependencies: sortObject(spec.dependencies.peer),
    devDependencies: sortObject(spec.dependencies.dev),
  });
}
