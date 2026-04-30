/**
 * Detects and reports differences in top-level package.json fields
 * such as `name`, `version`, `description`, `license`, `author`, and `repository`.
 */

export interface PackageFieldEntry {
  field: string;
  oldValue: string | undefined;
  newValue: string | undefined;
  status: 'added' | 'removed' | 'changed' | 'unchanged';
}

export interface PackageFieldReport {
  entries: PackageFieldEntry[];
  hasChanges: boolean;
}

const TRACKED_FIELDS: string[] = [
  'name',
  'version',
  'description',
  'license',
  'author',
  'repository',
  'homepage',
  'keywords',
];

function normalizeValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return (value as unknown[]).join(', ');
  return String(value);
}

export function diffPackageFields(
  pkgA: Record<string, unknown>,
  pkgB: Record<string, unknown>,
  fields: string[] = TRACKED_FIELDS
): PackageFieldReport {
  const entries: PackageFieldEntry[] = fields.map((field) => {
    const oldValue = normalizeValue(pkgA[field]);
    const newValue = normalizeValue(pkgB[field]);

    let status: PackageFieldEntry['status'];
    if (oldValue === undefined && newValue !== undefined) {
      status = 'added';
    } else if (oldValue !== undefined && newValue === undefined) {
      status = 'removed';
    } else if (oldValue !== newValue) {
      status = 'changed';
    } else {
      status = 'unchanged';
    }

    return { field, oldValue, newValue, status };
  });

  const hasChanges = entries.some((e) => e.status !== 'unchanged');
  return { entries, hasChanges };
}

export function buildPackageFieldReport(
  pkgA: Record<string, unknown>,
  pkgB: Record<string, unknown>,
  fields?: string[]
): PackageFieldReport {
  return diffPackageFields(pkgA, pkgB, fields);
}
