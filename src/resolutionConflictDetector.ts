import { DependencyMap } from './packageParser';

export interface ResolutionConflict {
  packageName: string;
  versions: string[];
  sources: string[];
}

export interface ResolutionConflictReport {
  conflicts: ResolutionConflict[];
  totalConflicts: number;
  hasConflicts: boolean;
}

/**
 * Detects packages that appear with multiple different versions
 * across two dependency maps (e.g., hoisted vs nested resolutions).
 */
export function detectResolutionConflicts(
  mapA: DependencyMap,
  mapB: DependencyMap,
  labelA = 'package-a',
  labelB = 'package-b'
): ResolutionConflictReport {
  const allPackages = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  const conflicts: ResolutionConflict[] = [];

  for (const pkg of allPackages) {
    const versionA = mapA[pkg];
    const versionB = mapB[pkg];

    if (versionA !== undefined && versionB !== undefined && versionA !== versionB) {
      conflicts.push({
        packageName: pkg,
        versions: [versionA, versionB],
        sources: [labelA, labelB],
      });
    }
  }

  conflicts.sort((a, b) => a.packageName.localeCompare(b.packageName));

  return {
    conflicts,
    totalConflicts: conflicts.length,
    hasConflicts: conflicts.length > 0,
  };
}

export function buildResolutionConflictReport(
  mapA: DependencyMap,
  mapB: DependencyMap,
  labelA?: string,
  labelB?: string
): ResolutionConflictReport {
  return detectResolutionConflicts(mapA, mapB, labelA, labelB);
}
