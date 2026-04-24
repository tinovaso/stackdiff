import { FlatDependencyMap } from "./packageParser";

export interface DeprecationEntry {
  name: string;
  version: string;
  message: string;
}

export interface DeprecationReport {
  deprecated: DeprecationEntry[];
  total: number;
  checkedCount: number;
}

/**
 * Simulates a deprecation check against a known list of deprecated packages.
 * In a real implementation this would call the npm registry.
 */
export function isDeprecated(
  name: string,
  version: string
): string | null {
  // Simulated registry data for deterministic testing
  const knownDeprecated: Record<string, string> = {
    "request": "Please use a modern HTTP client like node-fetch or axios.",
    "node-uuid": "Use the uuid package instead.",
    "nomnom": "Package abandoned. Use yargs or minimist instead.",
    "jade": "Renamed to pug. Please use pug instead.",
    "coffee-script": "CoffeeScript 1 is no longer maintained. Use coffeescript@2.",
  };
  return knownDeprecated[name] ?? null;
}

export function detectDeprecations(
  deps: FlatDependencyMap
): DeprecationReport {
  const deprecated: DeprecationEntry[] = [];

  for (const [name, version] of Object.entries(deps)) {
    const message = isDeprecated(name, version);
    if (message) {
      deprecated.push({ name, version, message });
    }
  }

  return {
    deprecated,
    total: deprecated.length,
    checkedCount: Object.keys(deps).length,
  };
}
