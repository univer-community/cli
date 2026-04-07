import { deriveProjectSpec } from "../domain/project-spec";
import type { IGeneratedFile, IGenerationOptions, IProjectSpec } from "../domain/types";
import { createPackageManifest } from "./package-manifest";
import { createRenderContext } from "./render-context";
import { renderTemplate } from "./render-template";
import { loadTemplate } from "./template-loader";
import { createTemplatePlan } from "./template-plan";

export function renderProjectFiles(spec: IProjectSpec): IGeneratedFile[] {
  const context = createRenderContext(spec);
  const files = createTemplatePlan(spec).map((descriptor) => ({
    path: descriptor.outputPath,
    content: renderTemplate(loadTemplate(descriptor.templatePath), context),
  }));

  return [
    ...files,
    {
      path: "package.json",
      content: createPackageManifest(spec),
    },
  ];
}

export function generateProjectFiles(input: IGenerationOptions): IGeneratedFile[] {
  return renderProjectFiles(deriveProjectSpec(input));
}
