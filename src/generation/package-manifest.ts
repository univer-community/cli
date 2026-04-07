import type { IProjectSpec } from "../domain/types";
import { sortObject, stringifyJson } from "./utils";

export function createPackageManifest(spec: IProjectSpec): string {
  return stringifyJson({
    name: spec.blueprint.packageName,
    version: spec.input.projectVersion,
    description: spec.metadata.description,
    keywords: spec.metadata.keywords,
    homepage: spec.metadata.homepage,
    license: spec.metadata.license,
    author: spec.metadata.author,
    type: "module",
    main: "./src/index.ts",
    types: "./lib/types/index.d.ts",
    exports: spec.exports.source,
    publishConfig: {
      access: "public",
      main: "./lib/es/index.js",
      module: "./lib/es/index.js",
      exports: spec.exports.publish,
    },
    files: ["lib"],
    directories: {
      lib: "lib",
    },
    scripts: sortObject({
      build: spec.scripts.build,
      "build:bundle": spec.scripts.buildBundle,
      "build:demo": spec.scripts.buildDemo,
      "build:types": spec.scripts.buildTypes,
      coverage: spec.scripts.coverage,
      dev: spec.scripts.devDemo,
      fmt: spec.scripts.fmt,
      "fmt:check": spec.scripts.fmtCheck,
      lint: spec.scripts.lint,
      "lint:fix": spec.scripts.lintFix,
      prepare: spec.scripts.prepare,
      test: spec.scripts.test,
      typecheck: spec.scripts.typecheck,
    }),
    dependencies: sortObject(spec.dependencies.runtime),
    peerDependencies: sortObject(spec.dependencies.peer),
    devDependencies: sortObject(spec.dependencies.dev),
    "simple-git-hooks": {
      "pre-commit": "pnpm lint:fix && pnpm fmt",
    },
  });
}
