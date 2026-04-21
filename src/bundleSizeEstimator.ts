import { DependencyMap } from './packageParser';

export interface BundleSizeEntry {
  name: string;
  version: string;
  estimatedKb: number;
  type: 'added' | 'removed' | 'changed';
  previousKb?: number;
  deltaKb?: number;
}

export interface BundleSizeReport {
  entries: BundleSizeEntry[];
  totalAddedKb: number;
  totalRemovedKb: number;
  netDeltaKb: number;
}

// Deterministic pseudo-size based on package name + version (for estimation)
export function estimatePackageSizeKb(name: string, version: string): number {
  let hash = 0;
  const str = `${name}@${version}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  // Produce a value between 5 and 500 kb
  return Math.round(5 + (hash % 495));
}

export function buildBundleSizeReport(
  before: DependencyMap,
  after: DependencyMap
): BundleSizeReport {
  const entries: BundleSizeEntry[] = [];
  const allNames = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const name of allNames) {
    const prevVersion = before[name];
    const nextVersion = after[name];

    if (!prevVersion && nextVersion) {
      const estimatedKb = estimatePackageSizeKb(name, nextVersion);
      entries.push({ name, version: nextVersion, estimatedKb, type: 'added', deltaKb: estimatedKb });
    } else if (prevVersion && !nextVersion) {
      const estimatedKb = estimatePackageSizeKb(name, prevVersion);
      entries.push({ name, version: prevVersion, estimatedKb, type: 'removed', deltaKb: -estimatedKb });
    } else if (prevVersion && nextVersion && prevVersion !== nextVersion) {
      const previousKb = estimatePackageSizeKb(name, prevVersion);
      const estimatedKb = estimatePackageSizeKb(name, nextVersion);
      entries.push({
        name,
        version: nextVersion,
        estimatedKb,
        type: 'changed',
        previousKb,
        deltaKb: estimatedKb - previousKb,
      });
    }
  }

  const totalAddedKb = entries
    .filter(e => e.type === 'added')
    .reduce((sum, e) => sum + e.estimatedKb, 0);

  const totalRemovedKb = entries
    .filter(e => e.type === 'removed')
    .reduce((sum, e) => sum + e.estimatedKb, 0);

  const netDeltaKb = entries.reduce((sum, e) => sum + (e.deltaKb ?? 0), 0);

  return { entries, totalAddedKb, totalRemovedKb, netDeltaKb };
}
