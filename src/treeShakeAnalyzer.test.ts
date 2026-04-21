import {
  isEsModuleCompatible,
  estimateSideEffects,
  computeTreeShakeResult,
  buildTreeShakeReport,
} from './treeShakeAnalyzer';

describe('isEsModuleCompatible', () => {
  it('returns true for scoped packages', () => {
    expect(isEsModuleCompatible('@angular/core')).toBe(true);
  });

  it('returns true for names containing esm', () => {
    expect(isEsModuleCompatible('lodash-esm')).toBe(true);
  });

  it('returns false for plain CJS packages', () => {
    expect(isEsModuleCompatible('express')).toBe(false);
  });
});

describe('estimateSideEffects', () => {
  it('returns empty array for known pure packages', () => {
    expect(estimateSideEffects('lodash-es')).toEqual([]);
    expect(estimateSideEffects('date-fns')).toEqual([]);
  });

  it('returns true for unknown packages', () => {
    expect(estimateSideEffects('express')).toBe(true);
  });
});

describe('computeTreeShakeResult', () => {
  it('computes savings for ESM + no side effects', () => {
    const result = computeTreeShakeResult('lodash-es', '4.17.21', 100);
    expect(result.esModuleCompatible).toBe(true);
    expect(result.savingsKb).toBeGreaterThan(0);
    expect(result.treeShakedEstimateKb).toBeLessThan(100);
  });

  it('computes zero savings for CJS', () => {
    const result = computeTreeShakeResult('express', '4.18.0', 100);
    expect(result.savingsKb).toBe(0);
    expect(result.treeShakedEstimateKb).toBe(100);
  });

  it('handles zero originalKb gracefully', () => {
    const result = computeTreeShakeResult('tiny', '1.0.0', 0);
    expect(result.savingsPercent).toBe(0);
  });
});

describe('buildTreeShakeReport', () => {
  it('aggregates totals correctly', () => {
    const deps = { 'lodash-es': '4.17.21', express: '4.18.0' };
    const sizeMap = { 'lodash-es': 200, express: 100 };
    const report = buildTreeShakeReport(deps, sizeMap);
    expect(report.results).toHaveLength(2);
    expect(report.totalOriginalKb).toBe(300);
    expect(report.totalShakedKb).toBeLessThanOrEqual(300);
    expect(report.totalSavingsKb).toBeGreaterThanOrEqual(0);
  });

  it('uses fallback size when not in sizeMap', () => {
    const deps = { react: '18.0.0' };
    const report = buildTreeShakeReport(deps, {});
    expect(report.results[0].originalEstimateKb).toBeGreaterThan(0);
  });
});
