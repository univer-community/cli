import type { IChoice, Shape, Surface } from "./types";

export const DEFAULT_UNIVER_VERSION = "0.20.0";
export const DEFAULT_PROJECT_VERSION = "0.1.0";
export const DEFAULT_PACKAGE_NAME = "@univer-community/sample-plugin";

export const SURFACE_CHOICES: IChoice<Surface>[] = [
  {
    label: "Sheets",
    value: "sheets",
    hint: "Spreadsheet-centric plugin with sheet lifecycle hooks.",
  },
  {
    label: "Docs",
    value: "docs",
    hint: "Document-centric plugin for rich-text features.",
  },
  {
    label: "Slides",
    value: "slides",
    hint: "Slide-centric plugin for presentation workflows.",
  },
  {
    label: "Universal",
    value: "universal",
    hint: "Plugin that is not bound to a specific unit type.",
  },
];

export const SHAPE_CHOICES: IChoice<Shape>[] = [
  {
    label: "logic-only",
    value: "logic-only",
    hint: "Single package with config, services, commands, and controllers.",
  },
  {
    label: "logic + ui",
    value: "logic-ui",
    hint: "Split logic and UI into separate packages.",
  },
  {
    label: "mobile-ui add-on",
    value: "mobile-ui-addon",
    hint: "Logic + UI package with an extra mobile plugin entry.",
  },
  {
    label: "worker/rpc companion",
    value: "worker-rpc-companion",
    hint: "Logic package with a worker plugin and RPC service channel.",
  },
];
