import { FlatDependencyMap } from './packageParser';

export interface SizeEntry {
  name: string;
  sizeA: number | null;
  sizeB: number | null;
  delta: number | null;
  percentChange: number | null;
}

export interface SizeComparisonReport {
  entries: SizeEntry[];
  totalSizeA: number;
  totalSizeB: number;
  totalDelta: number;
}

export function estimateSize(version: string): number {
  // Deterministic pseudo-size based on version string length and char codes
  let hash = version.length * 17;
  for (let i = 0; i < version.length; i++) {
    hash = (hash * 31 + version.charCodeAt(i)) & 0xffff;
  }
  return 10 + (hash % 490);
}

export function compareSizes(
  mapA: FlatDependencyMap,
  mapB: FlatDependencyMap
): SizeComparisonReport {
  const allNames = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  const entries: SizeEntry[] = [];

  let totalSizeA = 0;
  let totalSizeB = 0;

  for (const name of allNames) {
    const versionA = mapA[name] ?? null;
    const versionB = mapB[name] ?? null;
    const sizeA = versionA !== null ? estimateSize(versionA) : null;
    const sizeB = versionB !== null ? estimateSize(versionB) : null;

    if (sizeA !== null) totalSizeA += sizeA;
    if (sizeB !== null) totalSizeB += sizeB;

    const delta =
      sizeA !== null && sizeB !== null
        ? sizeB - sizeA
        : sizeB !== null
        ? sizeB
        : sizeA !== null
        ? -sizeA
        : null;

    const percentChange =
      sizeA !== null && sizeA > 0 && delta !== null
        ? Math.round((delta / sizeA) * 100)
        : null;

    entries.push({ name, sizeA, sizeB, delta, percentChange });
  }

  entries.sort((a, b) => {
    const da = Math.abs(a.delta ?? 0);
    const db = Math.abs(b.delta ?? 0);
    return db - da;
  });

  return {
    entries,
    totalSizeA,
    totalSizeB,
    totalDelta: totalSizeB - totalSizeA,
  };
}
