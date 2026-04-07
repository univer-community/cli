# {{PACKAGE_NAME}}

{{PACKAGE_DESCRIPTION}}

{{README_HIGHLIGHTS}}

## Installation

```bash
pnpm add {{PACKAGE_NAME}}
```

## Usage

### {{README_REGISTRATION_HEADING}}

```ts
import { {{README_USAGE_PLUGIN_CLASS}} } from "{{PACKAGE_NAME}}";

univer.registerPlugin({{README_USAGE_PLUGIN_CLASS}});
```

{{README_FACADE_SECTION}}{{README_WORKER_SECTION}}

## API Notes

{{README_API_NOTES}}

## Local Development

Install dependencies:

```bash
pnpm install
```

Run lint:

```bash
pnpm lint
```

Run tests:

```bash
pnpm test
```

Run type checking:

```bash
pnpm typecheck
```

Build the library:

```bash
pnpm build
```

{{README_DEVELOPMENT_EXTRA}}

## Build Output

Running `pnpm build` generates:

{{README_BUILD_OUTPUT}}

{{README_DEMO_SECTION}}

## License

MIT
