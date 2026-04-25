import {
  extractOptionalDeps,
  detectOptionalDependencies,
} from './optionalDependencyDetector';

describe('extractOptionalDeps', () => {
  it('returns empty map for undefined input', () => {
    expect(extractOptionalDeps(undefined as any)).toEqual({});
  });

  it('extracts string-valued entries only', () => {
    const input = { lodash: '^4.0.0', bad: 123 };
    expect(extractOptionalDeps(input)).toEqual({ lodash: '^4.0.0' });
  });

  it('returns all entries when all are strings', () => {
    const input = { react: '^18.0.0', 'react-dom': '^18.0.0' };
    expect(extractOptionalDeps(input)).toEqual(input);
  });
});

describe('detectOptionalDependencies', () => {
  const mapA = { lodash: '^4.0.0', moment: '^2.29.0' };
  const mapB = { lodash: '^4.0.0', dayjs: '^1.11.0' };

  it('identifies packages only in A', () => {
    const report = detectOptionalDependencies(mapA, mapB);
    expect(report.onlyInA).toHaveLength(1);
    expect(report.onlyInA[0].name).toBe('moment');
    expect(report.onlyInA[0].presentInA).toBe(true);
    expect(report.onlyInA[0].presentInB).toBe(false);
  });

  it('identifies packages only in B', () => {
    const report = detectOptionalDependencies(mapA, mapB);
    expect(report.onlyInB).toHaveLength(1);
    expect(report.onlyInB[0].name).toBe('dayjs');
    expect(report.onlyInB[0].presentInA).toBe(false);
    expect(report.onlyInB[0].presentInB).toBe(true);
  });

  it('identifies packages present in both', () => {
    const report = detectOptionalDependencies(mapA, mapB);
    expect(report.inBoth).toHaveLength(1);
    expect(report.inBoth[0].name).toBe('lodash');
  });

  it('computes total correctly', () => {
    const report = detectOptionalDependencies(mapA, mapB);
    expect(report.total).toBe(3);
  });

  it('handles empty maps', () => {
    const report = detectOptionalDependencies({}, {});
    expect(report.total).toBe(0);
    expect(report.onlyInA).toHaveLength(0);
    expect(report.onlyInB).toHaveLength(0);
    expect(report.inBoth).toHaveLength(0);
  });

  it('uses version from A when package only in A', () => {
    const report = detectOptionalDependencies({ pkg: '1.0.0' }, {});
    expect(report.onlyInA[0].version).toBe('1.0.0');
  });
});
