import { PackageJson } from './packageParser';

export interface OverrideEntry {
  name: string;
  overriddenVersion: string;
  side: 'A' | 'B' | 'both';
  overrideA?: string;
  overrideB?: string;
}

export interface OverrideReport {
  entries: OverrideEntry[];
  totalA: number;
  totalB: number;
}

function extractOverrides(pkg: PackageJson): Record<string, string> {
  const raw = (pkg as Record<string, unknown>)['overrides'];
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, string>;
  }
  return {};
}

export function detectOverrides(
  pkgA: PackageJson,
  pkgB: PackageJson
): OverrideReport {
  const overridesA = extractOverrides(pkgA);
  const overridesB = extractOverrides(pkgB);
  const allNames = new Set([...Object.keys(overridesA), ...Object.keys(overridesB)]);

  const entries: OverrideEntry[] = [];

  for (const name of allNames) {
    const inA = name in overridesA;
    const inB = name in overridesB;

    if (inA && inB) {
      entries.push({
        name,
        overriddenVersion: overridesA[name],
        side: 'both',
        overrideA: overridesA[name],
        overrideB: overridesB[name],
      });
    } else if (inA) {
      entries.push({ name, overriddenVersion: overridesA[name], side: 'A', overrideA: overridesA[name] });
    } else {
      entries.push({ name, overriddenVersion: overridesB[name], side: 'B', overrideB: overridesB[name] });
    }
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  return {
    entries,
    totalA: Object.keys(overridesA).length,
    totalB: Object.keys(overridesB).length,
  };
}
