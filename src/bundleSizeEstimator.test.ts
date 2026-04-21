import { estimatePackageSizeKb, buildBundleSizeReport } from './bundleSizeEstimator';

describe('estimatePackageSizeKb', () => {
  it('returns a number between 5 and 500', () => {
    const size = estimatePackageSizeKb('lodash', '4.17.21');
    expect(size).toBeGreaterThanOrEqual(5);
    expect(size).toBeLessThanOrEqual(500);
  });

  it('is deterministic for the same inputs', () => {
    const a = estimatePackageSizeKb('react', '18.2.0');
    const b = estimatePackageSizeKb('react', '18.2.0');
    expect(a).toBe(b);
  });

  it('differs for different versions', () => {
    const a = estimatePackageSizeKb('react', '17.0.0');
    const b = estimatePackageSizeKb('react', '18.0.0');
    expect(a).not.toBe(b);
  });
});

describe('buildBundleSizeReport', () => {
  const before = { lodash: '4.17.20', axios: '0.21.0' };
  const after = { lodash: '4.17.21', express: '4.18.0' };

  it('detects added packages', () => {
    const report = buildBundleSizeReport(before, after);
    const added = report.entries.filter(e => e.type === 'added');
    expect(added.map(e => e.name)).toContain('express');
  });

  it('detects removed packages', () => {
    const report = buildBundleSizeReport(before, after);
    const removed = report.entries.filter(e => e.type === 'removed');
    expect(removed.map(e => e.name)).toContain('axios');
  });

  it('detects changed packages', () => {
    const report = buildBundleSizeReport(before, after);
    const changed = report.entries.filter(e => e.type === 'changed');
    expect(changed.map(e => e.name)).toContain('lodash');
  });

  it('computes totalAddedKb from added entries only', () => {
    const report = buildBundleSizeReport(before, after);
    const expected = report.entries
      .filter(e => e.type === 'added')
      .reduce((s, e) => s + e.estimatedKb, 0);
    expect(report.totalAddedKb).toBe(expected);
  });

  it('computes totalRemovedKb from removed entries only', () => {
    const report = buildBundleSizeReport(before, after);
    const expected = report.entries
      .filter(e => e.type === 'removed')
      .reduce((s, e) => s + e.estimatedKb, 0);
    expect(report.totalRemovedKb).toBe(expected);
  });

  it('computes netDeltaKb as sum of all deltas', () => {
    const report = buildBundleSizeReport(before, after);
    const expected = report.entries.reduce((s, e) => s + (e.deltaKb ?? 0), 0);
    expect(report.netDeltaKb).toBe(expected);
  });

  it('returns empty report for identical inputs', () => {
    const same = { lodash: '4.17.21' };
    const report = buildBundleSizeReport(same, same);
    expect(report.entries).toHaveLength(0);
    expect(report.netDeltaKb).toBe(0);
  });
});
