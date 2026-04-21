import { DiffEntry } from './diffEngine';

export interface OutdatedEntry {
  name: string;
  current: string;
  latest: string;
  type: 'major' | 'minor' | 'patch' | 'unknown';
}

export interface OutdatedReport {
  entries: OutdatedEntry[];
  total: number;
  majorCount: number;
  minorCount: number;
  patchCount: number;
}

function classifyOutdated(
  current: string,
  latest: string
): 'major' | 'minor' | 'patch' | 'unknown' {
  const clean = (v: string) => v.replace(/^[^\d]*/, '');
  const currentParts = clean(current).split('.').map(Number);
  const latestParts = clean(latest).split('.').map(Number);

  if (currentParts.some(isNaN) || latestParts.some(isNaN)) return 'unknown';

  if (latestParts[0] > currentParts[0]) return 'major';
  if (latestParts[1] > currentParts[1]) return 'minor';
  if (latestParts[2] > currentParts[2]) return 'patch';
  return 'unknown';
}

export function detectOutdated(
  entries: DiffEntry[],
  latestVersions: Record<string, string>
): OutdatedReport {
  const outdated: OutdatedEntry[] = [];

  for (const entry of entries) {
    const current = entry.versionB ?? entry.versionA;
    if (!current) continue;
    const latest = latestVersions[entry.name];
    if (!latest || latest === current) continue;

    const type = classifyOutdated(current, latest);
    outdated.push({ name: entry.name, current, latest, type });
  }

  return {
    entries: outdated,
    total: outdated.length,
    majorCount: outdated.filter(e => e.type === 'major').length,
    minorCount: outdated.filter(e => e.type === 'minor').length,
    patchCount: outdated.filter(e => e.type === 'patch').length,
  };
}
