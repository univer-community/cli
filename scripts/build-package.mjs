import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

rmSync(path.resolve('dist'), { force: true, recursive: true });
run('pnpm', ['exec', 'tsc', '-p', 'tsconfig.build.json']);
run('node', ['./scripts/rewrite-dist-imports.mjs']);
run('node', ['./scripts/copy-runtime-assets.mjs']);
