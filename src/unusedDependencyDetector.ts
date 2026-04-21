import { DependencyMap } from './packageParser';

export interface UnusedDependencyEntry {
  name: string;
  version: string;
  presentIn: 'a' | 'b' | 'both';
}

export interface UnusedDependencyReport {
  unused: UnusedDependencyEntry[];
  total: number;
}

/**
 * Detects dependencies that appear in one package.json but are
 * completely absent from the other, treating them as potentially unused
 * or newly introduced/removed packages.
 */
export function detectUnused(
  depsA: DependencyMap,
  depsB: DependencyMap
): UnusedDependencyReport {
  const unused: UnusedDependencyEntry[] = [];

  for (const [name, version] of Object.entries(depsA)) {
    if (!(name in depsB)) {
      unused.push({ name, version, presentIn: 'a' });
    }
  }

  for (const [name, version] of Object.entries(depsB)) {
    if (!(name in depsA)) {
      unused.push({ name, version, presentIn: 'b' });
    }
  }

  unused.sort((x, y) => x.name.localeCompare(y.name));

  return {
    unused,
    total: unused.length,
  };
}

export function buildUnusedReport(
  depsA: DependencyMap,
  depsB: DependencyMap,
  labelA = 'Package A',
  labelB = 'Package B'
): string[] {
  const report = detectUnused(depsA, depsB);
  if (report.total === 0) {
    return ['No exclusive dependencies found between the two packages.'];
  }

  const lines: string[] = [`Exclusive dependencies (${report.total} total):`, ''];

  for (const entry of report.unused) {
    const source = entry.presentIn === 'a' ? labelA : labelB;
    lines.push(`  ${entry.name}@${entry.version}  [only in ${source}]`);
  }

  return lines;
}
