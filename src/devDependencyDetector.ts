import { PackageJson } from './packageParser';

export interface DevDependencyEntry {
  name: string;
  versionA: string | null;
  versionB: string | null;
  status: 'added' | 'removed' | 'changed' | 'unchanged';
}

export interface DevDependencyReport {
  entries: DevDependencyEntry[];
  totalAdded: number;
  totalRemoved: number;
  totalChanged: number;
}

export function diffDevDependencies(
  pkgA: PackageJson,
  pkgB: PackageJson
): DevDependencyEntry[] {
  const depsA = pkgA.devDependencies ?? {};
  const depsB = pkgB.devDependencies ?? {};
  const allNames = new Set([...Object.keys(depsA), ...Object.keys(depsB)]);
  const entries: DevDependencyEntry[] = [];

  for (const name of Array.from(allNames).sort()) {
    const versionA = depsA[name] ?? null;
    const versionB = depsB[name] ?? null;

    let status: DevDependencyEntry['status'];
    if (versionA === null) status = 'added';
    else if (versionB === null) status = 'removed';
    else if (versionA !== versionB) status = 'changed';
    else status = 'unchanged';

    entries.push({ name, versionA, versionB, status });
  }

  return entries;
}

export function buildDevDependencyReport(
  entries: DevDependencyEntry[]
): DevDependencyReport {
  return {
    entries,
    totalAdded: entries.filter(e => e.status === 'added').length,
    totalRemoved: entries.filter(e => e.status === 'removed').length,
    totalChanged: entries.filter(e => e.status === 'changed').length,
  };
}
