import { detectDuplicates, buildDuplicateReport } from './duplicateDetector';
import { FlatDependencyMap } from './packageParser';

const mapA: FlatDependencyMap = {
  react: '17.0.2',
  lodash: '4.17.21',
  axios: '0.21.1',
};

const mapB: FlatDependencyMap = {
  react: '18.2.0',
  lodash: '4.17.21',
  axios: '1.4.0',
  typescript: '5.0.0',
};

describe('detectDuplicates', () => {
  it('returns packages with differing versions', () => {
    const result = detectDuplicates(mapA, mapB);
    expect(result.map((d) => d.name)).toEqual(['axios', 'react']);
  });

  it('excludes packages with identical versions', () => {
    const result = detectDuplicates(mapA, mapB);
    expect(result.find((d) => d.name === 'lodash')).toBeUndefined();
  });

  it('excludes packages only present in one map', () => {
    const result = detectDuplicates(mapA, mapB);
    expect(result.find((d) => d.name === 'typescript')).toBeUndefined();
  });

  it('returns correct versions for a conflict', () => {
    const result = detectDuplicates(mapA, mapB);
    const react = result.find((d) => d.name === 'react');
    expect(react?.versions).toEqual(['17.0.2', '18.2.0']);
  });

  it('returns empty array when no conflicts exist', () => {
    const result = detectDuplicates({ a: '1.0.0' }, { a: '1.0.0' });
    expect(result).toHaveLength(0);
  });
});

describe('buildDuplicateReport', () => {
  it('reports correct total package count', () => {
    const report = buildDuplicateReport(mapA, mapB);
    expect(report.totalPackages).toBe(4);
  });

  it('reports correct duplicate count', () => {
    const report = buildDuplicateReport(mapA, mapB);
    expect(report.duplicateCount).toBe(2);
  });

  it('returns empty duplicates when maps are identical', () => {
    const report = buildDuplicateReport(mapA, mapA);
    expect(report.duplicateCount).toBe(0);
    expect(report.duplicates).toHaveLength(0);
  });
});
