export interface DependencyAgeOptions {
  enabled: boolean;
  registryUrl: string;
  minAgeDays: number | null;
  maxAgeDays: number | null;
}

export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';

export const dependencyAgeHelp = `
Dependency Age Options:
  --age                  Fetch and display publish age for each dependency
  --registry <url>       Custom npm registry URL (default: ${DEFAULT_REGISTRY})
  --min-age <days>       Only show dependencies older than N days
  --max-age <days>       Only show dependencies newer than N days
`.trim();

export function parseDependencyAgeOptions(
  args: string[]
): DependencyAgeOptions {
  const enabled = args.includes('--age');
  const registryIndex = args.indexOf('--registry');
  const registryUrl =
    registryIndex !== -1 && args[registryIndex + 1]
      ? args[registryIndex + 1]
      : DEFAULT_REGISTRY;

  const minAgeIndex = args.indexOf('--min-age');
  const minAgeDays =
    minAgeIndex !== -1 && args[minAgeIndex + 1]
      ? parseInt(args[minAgeIndex + 1], 10)
      : null;

  const maxAgeIndex = args.indexOf('--max-age');
  const maxAgeDays =
    maxAgeIndex !== -1 && args[maxAgeIndex + 1]
      ? parseInt(args[maxAgeIndex + 1], 10)
      : null;

  return { enabled, registryUrl, minAgeDays, maxAgeDays };
}

export function filterByAge(
  results: { ageDeltaDays: number | null; toAge: { ageInDays: number | null } | null }[],
  opts: DependencyAgeOptions
) {
  return results.filter((r) => {
    const age = r.toAge?.ageInDays ?? null;
    if (opts.minAgeDays !== null && (age === null || age < opts.minAgeDays)) return false;
    if (opts.maxAgeDays !== null && (age === null || age > opts.maxAgeDays)) return false;
    return true;
  });
}
