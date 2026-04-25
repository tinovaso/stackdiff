import { FlatDependencyMap } from './packageParser';

export interface OptionalDependencyEntry {
  name: string;
  version: string;
  presentInA: boolean;
  presentInB: boolean;
}

export interface OptionalDependencyReport {
  onlyInA: OptionalDependencyEntry[];
  onlyInB: OptionalDependencyEntry[];
  inBoth: OptionalDependencyEntry[];
  total: number;
}

export function extractOptionalDeps(
  deps: Record<string, unknown>
): FlatDependencyMap {
  const result: FlatDependencyMap = {};
  if (!deps || typeof deps !== 'object') return result;
  for (const [name, value] of Object.entries(deps)) {
    if (typeof value === 'string') {
      result[name] = value;
    }
  }
  return result;
}

export function detectOptionalDependencies(
  optionalA: FlatDependencyMap,
  optionalB: FlatDependencyMap
): OptionalDependencyReport {
  const allNames = new Set([
    ...Object.keys(optionalA),
    ...Object.keys(optionalB),
  ]);

  const onlyInA: OptionalDependencyEntry[] = [];
  const onlyInB: OptionalDependencyEntry[] = [];
  const inBoth: OptionalDependencyEntry[] = [];

  for (const name of allNames) {
    const inA = name in optionalA;
    const inB = name in optionalB;
    const entry: OptionalDependencyEntry = {
      name,
      version: optionalA[name] ?? optionalB[name],
      presentInA: inA,
      presentInB: inB,
    };
    if (inA && inB) {
      inBoth.push(entry);
    } else if (inA) {
      onlyInA.push(entry);
    } else {
      onlyInB.push(entry);
    }
  }

  return {
    onlyInA,
    onlyInB,
    inBoth,
    total: allNames.size,
  };
}
