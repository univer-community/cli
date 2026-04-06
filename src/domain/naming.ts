import type { Surface } from './types';

const SURFACE_PREFIX: Record<Surface, string> = {
  sheets: 'Sheets',
  docs: 'Docs',
  slides: 'Slides',
  universal: '',
};

const INSTANCE_TYPE: Record<Surface, string> = {
  sheets: 'UniverInstanceType.UNIVER_SHEET',
  docs: 'UniverInstanceType.UNIVER_DOC',
  slides: 'UniverInstanceType.UNIVER_SLIDE',
  universal: 'UniverInstanceType.UNIVER_UNKNOWN',
};

export function ensureKebabCase(value: string): string {
  const normalized = value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  if (!normalized) {
    throw new Error('Plugin name must contain at least one letter or number.');
  }

  return normalized;
}

export function toPascalCase(value: string): string {
  return ensureKebabCase(value)
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

export function toConstantCase(value: string): string {
  return ensureKebabCase(value).replace(/-/g, '_').toUpperCase();
}

export function getSurfacePrefix(surface: Surface): string {
  return SURFACE_PREFIX[surface];
}

export function getInstanceType(surface: Surface): string {
  return INSTANCE_TYPE[surface];
}
