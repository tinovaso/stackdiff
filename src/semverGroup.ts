/**
 * Groups dependencies by their semver range type (major, minor, patch, prerelease, etc.)
 */

export type SemverGroupType = 'major' | 'minor' | 'patch' | 'prerelease' | 'unknown';

export interface SemverGroupOptions {
  groupBy: SemverGroupType[];
}

export interface SemverGroupResult {
  group: SemverGroupType;
  name: string;
  from: string;
  to: string;
}

export function classifyVersionChange(from: string, to: string): SemverGroupType {
  const semverRegex = /^[~^]?(\d+)\.(\d+)\.(\d+)(?:-([\w.]+))?/;
  const fromMatch = from.match(semverRegex);
  const toMatch = to.match(semverRegex);

  if (!fromMatch || !toMatch) return 'unknown';

  const [, fromMajor, fromMinor, fromPatch, fromPre] = fromMatch;
  const [, toMajor, toMinor, toPatch, toPre] = toMatch;

  if (fromPre || toPre) return 'prerelease';
  if (fromMajor !== toMajor) return 'major';
  if (fromMinor !== toMinor) return 'minor';
  if (fromPatch !== toPatch) return 'patch';
  return 'unknown';
}

export function groupDiffBySemver(
  diff: Record<string, { from?: string; to?: string; type: string }>,
  options: SemverGroupOptions
): Map<SemverGroupType, SemverGroupResult[]> {
  const result = new Map<SemverGroupType, SemverGroupResult[]>();

  for (const [name, entry] of Object.entries(diff)) {
    if (entry.type !== 'changed' || !entry.from || !entry.to) continue;
    const group = classifyVersionChange(entry.from, entry.to);
    if (!options.groupBy.includes(group)) continue;
    if (!result.has(group)) result.set(group, []);
    result.get(group)!.push({ group, name, from: entry.from, to: entry.to });
  }

  return result;
}
