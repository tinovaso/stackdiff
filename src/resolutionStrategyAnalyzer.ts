import { FlatDependencyMap } from './packageParser';

export type ResolutionStrategy = 'exact' | 'caret' | 'tilde' | 'range' | 'wildcard' | 'unknown';

export interface ResolutionStrategyEntry {
  name: string;
  version: string;
  strategy: ResolutionStrategy;
  side: 'a' | 'b' | 'both';
}

export interface ResolutionStrategyReport {
  entries: ResolutionStrategyEntry[];
  summary: Record<ResolutionStrategy, number>;
}

export function classifyStrategy(version: string): ResolutionStrategy {
  if (!version || version === '*' || version === 'latest') return 'wildcard';
  if (/^\d+\.\d+\.\d+$/.test(version)) return 'exact';
  if (version.startsWith('^')) return 'caret';
  if (version.startsWith('~')) return 'tilde';
  if (/[<>= ]/.test(version) || version.includes('||')) return 'range';
  return 'unknown';
}

export function analyzeResolutionStrategies(
  mapA: FlatDependencyMap,
  mapB: FlatDependencyMap
): ResolutionStrategyReport {
  const entries: ResolutionStrategyEntry[] = [];
  const allNames = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);

  for (const name of allNames) {
    const vA = mapA[name];
    const vB = mapB[name];

    if (vA !== undefined && vB !== undefined) {
      const strategy = classifyStrategy(vB);
      entries.push({ name, version: vB, strategy, side: 'both' });
    } else if (vA !== undefined) {
      const strategy = classifyStrategy(vA);
      entries.push({ name, version: vA, strategy, side: 'a' });
    } else if (vB !== undefined) {
      const strategy = classifyStrategy(vB);
      entries.push({ name, version: vB, strategy, side: 'b' });
    }
  }

  const summary: Record<ResolutionStrategy, number> = {
    exact: 0, caret: 0, tilde: 0, range: 0, wildcard: 0, unknown: 0,
  };
  for (const e of entries) {
    summary[e.strategy]++;
  }

  return { entries, summary };
}
