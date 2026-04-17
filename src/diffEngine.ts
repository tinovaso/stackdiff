import { FlatDependencies } from './packageParser';

export type DiffStatus = 'added' | 'removed' | 'upgraded' | 'downgraded' | 'unchanged';

export interface DependencyDiff {
  name: string;
  status: DiffStatus;
  versionA?: string;
  versionB?: string;
}

export interface DiffResult {
  added: DependencyDiff[];
  removed: DependencyDiff[];
  upgraded: DependencyDiff[];
  downgraded: DependencyDiff[];
  unchanged: DependencyDiff[];
}

export function diffDependencies(
  depsA: FlatDependencies,
  depsB: FlatDependencies
): DiffResult {
  const result: DiffResult = {
    added: [],
    removed: [],
    upgraded: [],
    downgraded: [],
    unchanged: [],
  };

  const allKeys = new Set([...Object.keys(depsA), ...Object.keys(depsB)]);

  for (const name of allKeys) {
    const versionA = depsA[name];
    const versionB = depsB[name];

    if (!versionA) {
      result.added.push({ name, status: 'added', versionB });
    } else if (!versionB) {
      result.removed.push({ name, status: 'removed', versionA });
    } else if (versionA === versionB) {
      result.unchanged.push({ name, status: 'unchanged', versionA, versionB });
    } else {
      const status = compareVersions(versionA, versionB);
      result[status].push({ name, status, versionA, versionB });
    }
  }

  return result;
}

function compareVersions(vA: string, vB: string): 'upgraded' | 'downgraded' {
  const parse = (v: string) => v.replace(/^[^\d]*/, '').split('.').map(Number);
  const a = parse(vA);
  const b = parse(vB);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (b[i] ?? 0) - (a[i] ?? 0);
    if (diff > 0) return 'upgraded';
    if (diff < 0) return 'downgraded';
  }
  return 'upgraded';
}
