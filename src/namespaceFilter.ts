/**
 * Filters dependency diff results by npm package namespace (scope).
 * e.g. "@babel" matches "@babel/core", "@babel/preset-env", etc.
 */

import { DiffResult } from './diffEngine';

export interface NamespaceFilterOptions {
  includeNamespaces: string[];
  excludeNamespaces: string[];
}

export function parseNamespaceFilterOptions(
  args: Record<string, string | boolean | string[]>
): NamespaceFilterOptions {
  const toArray = (val: string | boolean | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };

  return {
    includeNamespaces: toArray(args['namespace'] ?? args['ns']),
    excludeNamespaces: toArray(args['exclude-namespace'] ?? args['ens']),
  };
}

export function getPackageNamespace(packageName: string): string | null {
  if (packageName.startsWith('@')) {
    const parts = packageName.split('/');
    if (parts.length >= 2) {
      return parts[0];
    }
  }
  return null;
}

export function filterByNamespace(
  diff: DiffResult[],
  options: NamespaceFilterOptions
): DiffResult[] {
  const { includeNamespaces, excludeNamespaces } = options;

  if (includeNamespaces.length === 0 && excludeNamespaces.length === 0) {
    return diff;
  }

  return diff.filter((entry) => {
    const ns = getPackageNamespace(entry.name);

    if (excludeNamespaces.length > 0 && ns && excludeNamespaces.includes(ns)) {
      return false;
    }

    if (includeNamespaces.length > 0) {
      return ns !== null && includeNamespaces.includes(ns);
    }

    return true;
  });
}
