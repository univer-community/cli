import { deriveProjectSpec } from "../domain/project-spec";
import type { GeneratedFile, GenerationOptions, ProjectSpec } from "../domain/types";
import { createPackageManifest } from "./package-manifest";
import { createRenderContext } from "./render-context";
import { renderTemplate } from "./render-template";
import { loadTemplate } from "./template-loader";
import { createTemplatePlan } from "./template-plan";

export function renderProjectFiles(spec: ProjectSpec): GeneratedFile[] {
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

export function generateProjectFiles(input: GenerationOptions): GeneratedFile[] {
  return renderProjectFiles(deriveProjectSpec(input));
}
