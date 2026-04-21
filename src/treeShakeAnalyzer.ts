import { DependencyMap } from './packageParser';

export interface TreeShakeResult {
  name: string;
  version: string;
  esModuleCompatible: boolean;
  sideEffects: boolean | string[];
  treeShakedEstimateKb: number;
  originalEstimateKb: number;
  savingsKb: number;
  savingsPercent: number;
}

export interface TreeShakeReport {
  results: TreeShakeResult[];
  totalOriginalKb: number;
  totalShakedKb: number;
  totalSavingsKb: number;
  totalSavingsPercent: number;
}

const ES_MODULE_PATTERNS = ['esm', 'es2015', 'module', 'mjs'];

export function isEsModuleCompatible(name: string): boolean {
  const lowerName = name.toLowerCase();
  return ES_MODULE_PATTERNS.some((p) => lowerName.includes(p)) || lowerName.startsWith('@');
}

export function estimateSideEffects(name: string): boolean | string[] {
  const noSideEffects = ['lodash-es', 'date-fns', 'ramda', 'fp-ts', 'rxjs'];
  if (noSideEffects.includes(name)) return [];
  return true;
}

export function computeTreeShakeResult(
  name: string,
  version: string,
  originalKb: number
): TreeShakeResult {
  const esModuleCompatible = isEsModuleCompatible(name);
  const sideEffects = estimateSideEffects(name);
  const hasSideEffects = sideEffects === true;
  const savingsFactor = esModuleCompatible && !hasSideEffects ? 0.45 : esModuleCompatible ? 0.2 : 0;
  const savingsKb = parseFloat((originalKb * savingsFactor).toFixed(2));
  const treeShakedEstimateKb = parseFloat((originalKb - savingsKb).toFixed(2));
  const savingsPercent = originalKb > 0 ? parseFloat(((savingsKb / originalKb) * 100).toFixed(1)) : 0;

  return { name, version, esModuleCompatible, sideEffects, treeShakedEstimateKb, originalEstimateKb: originalKb, savingsKb, savingsPercent };
}

export function buildTreeShakeReport(
  deps: DependencyMap,
  sizeMap: Record<string, number>
): TreeShakeReport {
  const results: TreeShakeResult[] = Object.entries(deps).map(([name, version]) => {
    const originalKb = sizeMap[name] ?? Math.round((name.length * 3 + 10) * 0.8);
    return computeTreeShakeResult(name, version, originalKb);
  });

  const totalOriginalKb = parseFloat(results.reduce((s, r) => s + r.originalEstimateKb, 0).toFixed(2));
  const totalShakedKb = parseFloat(results.reduce((s, r) => s + r.treeShakedEstimateKb, 0).toFixed(2));
  const totalSavingsKb = parseFloat((totalOriginalKb - totalShakedKb).toFixed(2));
  const totalSavingsPercent = totalOriginalKb > 0
    ? parseFloat(((totalSavingsKb / totalOriginalKb) * 100).toFixed(1))
    : 0;

  return { results, totalOriginalKb, totalShakedKb, totalSavingsKb, totalSavingsPercent };
}
