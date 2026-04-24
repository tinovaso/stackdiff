import { FlatDependencyMap } from './packageParser';

export interface AliasEntry {
  alias: string;
  resolvedPackage: string;
  version: string;
}

export interface AliasReport {
  aliases: AliasEntry[];
  totalCount: number;
}

/**
 * Detects npm package aliases (e.g. "foo": "npm:bar@^1.0.0").
 * Aliases follow the pattern: npm:<packageName>@<versionRange>
 */
export function isAlias(version: string): boolean {
  return version.startsWith('npm:');
}

export function parseAlias(alias: string, version: string): AliasEntry | null {
  if (!isAlias(version)) return null;
  const inner = version.slice(4); // strip 'npm:'
  const atIndex = inner.lastIndexOf('@');
  if (atIndex <= 0) return null;
  const resolvedPackage = inner.slice(0, atIndex);
  const resolvedVersion = inner.slice(atIndex + 1);
  return {
    alias,
    resolvedPackage,
    version: resolvedVersion,
  };
}

export function detectAliases(deps: FlatDependencyMap): AliasReport {
  const aliases: AliasEntry[] = [];
  for (const [name, version] of Object.entries(deps)) {
    const entry = parseAlias(name, version);
    if (entry) aliases.push(entry);
  }
  return {
    aliases,
    totalCount: aliases.length,
  };
}
