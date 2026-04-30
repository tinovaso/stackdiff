import { compareSizes, estimateSize, SizeComparisonReport } from './packageSizeComparator';

describe('estimateSize', () => {
  it('returns a positive number for any version string', () => {
    expect(estimateSize('1.0.0')).toBeGreaterThan(0);
    expect(estimateSize('2.3.4')).toBeGreaterThan(0);
  });

  it('returns consistent results for the same input', () => {
    expect(estimateSize('1.2.3')).toBe(estimateSize('1.2.3'));
  });

  it('returns different sizes for different versions', () => {
    const a = estimateSize('1.0.0');
    const b = estimateSize('9.9.9');
    expect(a).not.toBe(b);
  });
});

describe('compareSizes', () => {
  const mapA = { react: '17.0.2', lodash: '4.17.21' };
  const mapB = { react: '18.2.0', lodash: '4.17.21', axios: '1.4.0' };

  let report: SizeComparisonReport;

  beforeEach(() => {
    report = compareSizes(mapA, mapB);
  });

  it('includes all packages from both maps', () => {
    const names = report.entries.map((e) => e.name);
    expect(names).toContain('react');
    expect(names).toContain('lodash');
    expect(names).toContain('axios');
  });

  it('has null sizeA for packages only in mapB', () => {
    const axios = report.entries.find((e) => e.name === 'axios');
    expect(axios?.sizeA).toBeNull();
    expect(axios?.sizeB).not.toBeNull();
  });

  it('computes delta correctly for changed package', () => {
    const react = report.entries.find((e) => e.name === 'react')!;
    expect(react.delta).toBe((react.sizeB ?? 0) - (react.sizeA ?? 0));
  });

  it('computes zero delta for unchanged version', () => {
    const lodash = report.entries.find((e) => e.name === 'lodash')!;
    expect(lodash.delta).toBe(0);
    expect(lodash.percentChange).toBe(0);
  });

  it('sorts entries by absolute delta descending', () => {
    const deltas = report.entries.map((e) => Math.abs(e.delta ?? 0));
    for (let i = 1; i < deltas.length; i++) {
      expect(deltas[i - 1]).toBeGreaterThanOrEqual(deltas[i]);
    }
  });

  it('computes total sizes', () => {
    expect(report.totalSizeA).toBeGreaterThan(0);
    expect(report.totalSizeB).toBeGreaterThan(0);
    expect(report.totalDelta).toBe(report.totalSizeB - report.totalSizeA);
  });
});
