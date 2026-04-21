import { DiffEntry } from './diffEngine';

export interface PinnedEntry {
  name: string;
  version: string;
  source: 'a' | 'b' | 'both';
}

export interface PinnedVersionReport {
  pinned: PinnedEntry[];
  total: number;
}

/**
 * Returns true if a version string is an exact pinned version
 * (no range operators like ^, ~, >, <, *, x)
 */
export function isPinned(version: string): boolean {
  if (!version || version === '*' || version === 'latest') return false;
  return !/[\^~><=*x]/.test(version);
}

/**
 * Detects pinned (exact) versions from a flat dependency map.
 */
export function detectPinnedFromMap(
  deps: Record<string, string>,
  source: 'a' | 'b'
): PinnedEntry[] {
  return Object.entries(deps)
    .filter(([, version]) => isPinned(version))
    .map(([name, version]) => ({ name, version, source }));
}

/**
 * Detects pinned versions across both sides of a diff.
 * Marks entries as 'a', 'b', or 'both' depending on presence.
 */
export function detectPinnedVersions(
  depsA: Record<string, string>,
  depsB: Record<string, string>
): PinnedVersionReport {
  const pinnedA = new Map(detectPinnedFromMap(depsA, 'a').map(e => [e.name, e]));
  const pinnedB = new Map(detectPinnedFromMap(depsB, 'b').map(e => [e.name, e]));

  const allNames = new Set([...pinnedA.keys(), ...pinnedB.keys()]);
  const pinned: PinnedEntry[] = [];

  for (const name of allNames) {
    const inA = pinnedA.has(name);
    const inB = pinnedB.has(name);
    const entry = (inA ? pinnedA.get(name) : pinnedB.get(name))!;
    pinned.push({
      name,
      version: entry.version,
      source: inA && inB ? 'both' : inA ? 'a' : 'b',
    });
  }

  pinned.sort((a, b) => a.name.localeCompare(b.name));

  return { pinned, total: pinned.length };
}
