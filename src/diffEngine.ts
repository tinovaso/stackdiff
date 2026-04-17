export type DiffType = 'added' | 'removed' | 'changed';

export interface DiffResult {
  name: string;
  type: DiffType;
  versionA: string | undefined;
  versionB: string | undefined;
}

export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^[^\d]*/, '').split('.').map(Number);
  const pb = b.replace(/^[^\d]*/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function diffDependencies(
  depsA: Record<string, string>,
  depsB: Record<string, string>
): DiffResult[] {
  const results: DiffResult[] = [];
  const allKeys = new Set([...Object.keys(depsA), ...Object.keys(depsB)]);

  for (const name of allKeys) {
    const vA = depsA[name];
    const vB = depsB[name];

    if (!vA && vB) {
      results.push({ name, type: 'added', versionA: undefined, versionB: vB });
    } else if (vA && !vB) {
      results.push({ name, type: 'removed', versionA: vA, versionB: undefined });
    } else if (vA && vB && vA !== vB) {
      results.push({ name, type: 'changed', versionA: vA, versionB: vB });
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
