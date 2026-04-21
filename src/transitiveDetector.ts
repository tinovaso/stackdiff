import { DependencyMap } from './packageParser';

export interface TransitiveDependency {
  name: string;
  version: string;
  introducedBy: string[];
  depth: number;
}

export interface TransitiveReport {
  direct: string[];
  transitive: TransitiveDependency[];
  totalTransitive: number;
}

export function findTransitiveDependencies(
  root: DependencyMap,
  allPackages: Record<string, DependencyMap>
): TransitiveReport {
  const direct = Object.keys(root);
  const transitive: Map<string, TransitiveDependency> = new Map();

  function walk(deps: DependencyMap, introducedBy: string[], depth: number): void {
    for (const [name, version] of Object.entries(deps)) {
      if (direct.includes(name)) continue;

      const existing = transitive.get(name);
      if (existing) {
        for (const src of introducedBy) {
          if (!existing.introducedBy.includes(src)) {
            existing.introducedBy.push(src);
          }
        }
        continue;
      }

      transitive.set(name, {
        name,
        version,
        introducedBy: [...introducedBy],
        depth,
      });

      const nested = allPackages[name];
      if (nested) {
        walk(nested, [name], depth + 1);
      }
    }
  }

  for (const [name, version] of Object.entries(root)) {
    const nested = allPackages[name];
    if (nested) {
      walk(nested, [name], 2);
    }
  }

  const transitiveList = Array.from(transitive.values());

  return {
    direct,
    transitive: transitiveList,
    totalTransitive: transitiveList.length,
  };
}

export function buildTransitiveReport(report: TransitiveReport): string {
  const lines: string[] = [
    `Direct dependencies: ${report.direct.length}`,
    `Transitive dependencies: ${report.totalTransitive}`,
    '',
  ];

  for (const dep of report.transitive.sort((a, b) => a.depth - b.depth || a.name.localeCompare(b.name))) {
    lines.push(`  ${dep.name}@${dep.version} (depth ${dep.depth}, via: ${dep.introducedBy.join(', ')})`);
  }

  return lines.join('\n');
}
