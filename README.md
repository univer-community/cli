# @univer-community/cli

An interactive scaffold for generating standalone `Univer` plugin projects.

## Introduction

This CLI tool provides a streamlined experience for creating new `Univer` plugin projects. It guides you through a series of prompts to define your project specifications, then generates a ready-to-use project structure with all necessary configuration, dependencies, and boilerplate code.

## Usage

```bash
# npm
npm create @univer-community/cli@latest

# pnpm
pnpm create @univer-community/cli@latest
```

## Development

Install and validate the scaffold itself:

```bash
pnpm install
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

## Internal architecture

- `src/domain`: naming rules and project spec derivation
- `src/generation`: template planning, render context creation, manifest generation, and file writing
- `src/prompts`: interactive CLI question flow
- `src/templates`: runtime template assets copied into `dist/templates`
- `scripts/build-package.mjs`: clean scaffold build for the CLI itself

## Generated shapes

- `logic-only`
- `logic + ui`
- `mobile-ui add-on`
- `worker/rpc companion`
