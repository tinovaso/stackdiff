import { FlatDependencyMap } from './packageParser';

export interface DuplicateEntry {
  name: string;
  versions: string[];
  sources: string[];
}

export interface DuplicateReport {
  duplicates: DuplicateEntry[];
  totalPackages: number;
  duplicateCount: number;
}

/**
 * Finds packages that appear in both dependency maps with different versions.
 */
export function detectDuplicates(
  mapA: FlatDependencyMap,
  mapB: FlatDependencyMap
): DuplicateEntry[] {
  const duplicates: DuplicateEntry[] = [];

  const allNames = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);

  for (const name of allNames) {
    const versionA = mapA[name];
    const versionB = mapB[name];

    if (versionA && versionB && versionA !== versionB) {
      duplicates.push({
        name,
        versions: [versionA, versionB],
        sources: ['package-a', 'package-b'],
      });
    }
  }

  return duplicates.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Builds a full duplicate report from two flat dependency maps.
 */
export function buildDuplicateReport(
  mapA: FlatDependencyMap,
  mapB: FlatDependencyMap
): DuplicateReport {
  const duplicates = detectDuplicates(mapA, mapB);
  const allNames = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);

  return {
    duplicates,
    totalPackages: allNames.size,
    duplicateCount: duplicates.length,
  };
}
