import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const TARGET_EXTENSIONS = new Set(['.js', '.d.ts']);
const IMPORT_EXPORT_REWRITES = [
  /^(\s*import\s+(?:type\s+)?(?:.+?\s+from\s+)?['"])(\.\.?\/[^'"]+)(['"])/gm,
  /^(\s*export\s+(?:type\s+)?(?:.+?\s+from\s+['"]))(\.\.?\/[^'"]+)(['"])/gm,
];

function shouldRewrite(specifier) {
  return path.extname(specifier) === '';
}

function rewriteRelativeSpecifiers(source) {
  let rewritten = source;

  for (const expression of IMPORT_EXPORT_REWRITES) {
    rewritten = rewritten.replace(expression, (match, prefix, specifier, quote) => {
      if (!shouldRewrite(specifier)) {
        return match;
      }

      return `${prefix}${specifier}.js${quote}`;
    });
  }

  return rewritten;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walk(absolutePath);
      continue;
    }

    const extension = entry.name.endsWith('.d.ts') ? '.d.ts' : path.extname(entry.name);
    if (!TARGET_EXTENSIONS.has(extension)) {
      continue;
    }

    const source = await readFile(absolutePath, 'utf8');
    const rewritten = rewriteRelativeSpecifiers(source);

    if (rewritten !== source) {
      await writeFile(absolutePath, rewritten, 'utf8');
    }
  }
}

const distStats = await stat(DIST_DIR).catch(() => null);
if (distStats?.isDirectory()) {
  await walk(DIST_DIR);
}
