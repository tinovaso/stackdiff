import { PackageJson } from './packageParser';

export interface TagEntry {
  name: string;
  side: 'a' | 'b' | 'both';
  tagsA: string[];
  tagsB: string[];
  added: string[];
  removed: string[];
  unchanged: string[];
}

export interface TagReport {
  entries: TagEntry[];
  totalAdded: number;
  totalRemoved: number;
}

export function extractTags(pkg: PackageJson, name: string): string[] {
  const keywords = (pkg as any).keywords;
  if (!Array.isArray(keywords)) return [];
  return keywords.filter((k): k is string => typeof k === 'string');
}

export function detectTagChanges(
  pkgA: PackageJson,
  pkgB: PackageJson
): TagReport {
  const depsA: Record<string, string> = {
    ...(pkgA.dependencies ?? {}),
    ...(pkgA.devDependencies ?? {}),
  };
  const depsB: Record<string, string> = {
    ...(pkgB.dependencies ?? {}),
    ...(pkgB.devDependencies ?? {}),
  };

  const allNames = new Set([...Object.keys(depsA), ...Object.keys(depsB)]);
  const entries: TagEntry[] = [];
  let totalAdded = 0;
  let totalRemoved = 0;

  for (const name of allNames) {
    const tagsA = depsA[name] ? [depsA[name]] : [];
    const tagsB = depsB[name] ? [depsB[name]] : [];
    const setA = new Set(tagsA);
    const setB = new Set(tagsB);
    const added = tagsB.filter((t) => !setA.has(t));
    const removed = tagsA.filter((t) => !setB.has(t));
    const unchanged = tagsA.filter((t) => setB.has(t));

    const inA = name in depsA;
    const inB = name in depsB;
    const side: 'a' | 'b' | 'both' = inA && inB ? 'both' : inA ? 'a' : 'b';

    if (added.length > 0 || removed.length > 0) {
      totalAdded += added.length;
      totalRemoved += removed.length;
      entries.push({ name, side, tagsA, tagsB, added, removed, unchanged });
    }
  }

  return { entries, totalAdded, totalRemoved };
}
