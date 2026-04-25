import { DiffEntry } from './diffEngine';

export interface PrivatePackageEntry {
  name: string;
  version: string;
  side: 'added' | 'removed' | 'both';
}

export interface PrivatePackageReport {
  entries: PrivatePackageEntry[];
  total: number;
}

/**
 * Determines whether a package version string indicates a private/local package.
 * Private packages typically use file:, link:, git+, or github: protocols.
 */
export function isPrivatePackage(version: string): boolean {
  return (
    version.startsWith('file:') ||
    version.startsWith('link:') ||
    version.startsWith('git+') ||
    version.startsWith('git://') ||
    version.startsWith('github:') ||
    version.startsWith('bitbucket:') ||
    version.startsWith('gitlab:') ||
    /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/.test(version)
  );
}

export function detectPrivatePackages(
  diff: DiffEntry[],
  deps: Record<string, string>
): PrivatePackageReport {
  const entries: PrivatePackageEntry[] = [];

  for (const [name, version] of Object.entries(deps)) {
    if (!isPrivatePackage(version)) continue;

    const inDiff = diff.find((d) => d.name === name);
    let side: PrivatePackageEntry['side'] = 'both';
    if (inDiff?.type === 'added') side = 'added';
    else if (inDiff?.type === 'removed') side = 'removed';

    entries.push({ name, version, side });
  }

  return { entries, total: entries.length };
}
