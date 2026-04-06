# {{PACKAGE_NAME}}

Generated with `create-univer-plugin`.

- Surface: `{{README_SURFACE}}`
- Shape: `{{README_SHAPE}}`
- Version target: `{{README_VERSION}}`

## Usage

Install dependencies and run the checks:

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

Start the demo locally when this project includes one:

```bash
pnpm dev
```

## Development

Project layout:

- `src/`: plugin source
- `src/plugin.ts`: logic plugin entry
- `src/ui-plugin.ts`: UI plugin entry when the selected shape includes UI
- `src/mobile-plugin.ts`: mobile UI entry when the selected shape includes mobile support
- `src/locale/`: plugin locale bundles when locale output is enabled
- `demo/`: minimal local demo for manual verification
- `scripts/build.ts`: bundle build entry

```bash
{{README_COMMANDS}}
```
