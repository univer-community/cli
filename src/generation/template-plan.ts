import type { IProjectSpec } from "../domain/types";

export interface TemplateDescriptor {
  outputPath: string;
  templatePath: string;
}

export function createTemplatePlan(spec: IProjectSpec): TemplateDescriptor[] {
  const descriptors: TemplateDescriptor[] = [
    { outputPath: ".editorconfig", templatePath: "root/.editorconfig.tpl" },
    { outputPath: ".gitignore", templatePath: "root/.gitignore.tpl" },
    { outputPath: ".npmignore", templatePath: "root/.npmignore.tpl" },
    { outputPath: "LICENSE", templatePath: "root/LICENSE.tpl" },
    { outputPath: "oxfmt.config.ts", templatePath: "root/oxfmt.config.ts.tpl" },
    { outputPath: "oxlint.config.ts", templatePath: "root/oxlint.config.ts.tpl" },
    { outputPath: "README.md", templatePath: "root/README.md.tpl" },
    { outputPath: "tsconfig.json", templatePath: "root/tsconfig.json.tpl" },
    { outputPath: "tsconfig.node.json", templatePath: "root/tsconfig.node.json.tpl" },
    { outputPath: "vitest.config.ts", templatePath: "root/vitest.config.ts.tpl" },
    { outputPath: "scripts/build.mjs", templatePath: "root/scripts/build.mjs.tpl" },
    { outputPath: "src/globals.d.ts", templatePath: "root/src/globals.d.ts.tpl" },
    { outputPath: "src/index.ts", templatePath: "root/src/index.ts.tpl" },
    { outputPath: "src/plugin.ts", templatePath: "root/src/plugin.ts.tpl" },
    { outputPath: "src/config/config.ts", templatePath: "root/src/config/config.ts.tpl" },
    {
      outputPath: `src/services/${spec.input.pluginSlug}.service.ts`,
      templatePath: "root/src/services/feature.service.ts.tpl",
    },
    {
      outputPath: `src/controllers/${spec.input.pluginSlug}.controller.ts`,
      templatePath: "root/src/controllers/feature.controller.ts.tpl",
    },
    { outputPath: "src/__tests__/plugin.spec.ts", templatePath: "root/src/__tests__/plugin.spec.ts.tpl" },
  ];

  if (spec.blueprint.includeUiPlugin) {
    descriptors.push(
      { outputPath: "src/ui-plugin.ts", templatePath: "root/src/ui-plugin.ts.tpl" },
      { outputPath: "src/config/ui-config.ts", templatePath: "root/src/config/ui-config.ts.tpl" },
    );
  }
  if (spec.blueprint.includeMobileEntry) {
    descriptors.push({ outputPath: "src/mobile-plugin.ts", templatePath: "root/src/mobile-plugin.ts.tpl" });
  }
  if (spec.blueprint.includeWorkerEntry) {
    descriptors.push(
      { outputPath: "src/worker/plugin.ts", templatePath: "root/src/worker/plugin.ts.tpl" },
      {
        outputPath: `src/worker/${spec.input.pluginSlug}.worker.service.ts`,
        templatePath: "root/src/worker/feature.worker.service.ts.tpl",
      },
    );
  }
  if (spec.blueprint.includeFacade) {
    descriptors.push({ outputPath: "src/facade/index.ts", templatePath: "root/src/facade/index.ts.tpl" });
  }
  if (spec.blueprint.includeLocale) {
    descriptors.push({ outputPath: "src/locale/en-US.ts", templatePath: "root/src/locale/en-US.ts.tpl" });
  }
  if (spec.blueprint.includeDemo) {
    descriptors.push(
      { outputPath: "vite.demo.config.ts", templatePath: "root/vite.demo.config.ts.tpl" },
      { outputPath: "demo/index.html", templatePath: "root/demo/index.html.tpl" },
      { outputPath: "demo/main.ts", templatePath: "root/demo/main.ts.tpl" },
    );
  }

  return descriptors;
}
