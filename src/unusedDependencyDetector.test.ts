import { detectUnused, buildUnusedReport } from './unusedDependencyDetector';
import { DependencyMap } from './packageParser';

const depsA: DependencyMap = {
  react: '18.0.0',
  lodash: '4.17.21',
  axios: '1.2.0',
};

const depsB: DependencyMap = {
  react: '18.2.0',
  lodash: '4.17.21',
  'date-fns': '2.30.0',
};

describe('detectUnused', () => {
  it('finds packages only in A', () => {
    const result = detectUnused(depsA, depsB);
    const onlyInA = result.unused.filter((e) => e.presentIn === 'a');
    expect(onlyInA).toHaveLength(1);
    expect(onlyInA[0].name).toBe('axios');
  });

  it('finds packages only in B', () => {
    const result = detectUnused(depsA, depsB);
    const onlyInB = result.unused.filter((e) => e.presentIn === 'b');
    expect(onlyInB).toHaveLength(1);
    expect(onlyInB[0].name).toBe('date-fns');
  });

  it('does not include packages present in both', () => {
    const result = detectUnused(depsA, depsB);
    const names = result.unused.map((e) => e.name);
    expect(names).not.toContain('react');
    expect(names).not.toContain('lodash');
  });

  it('returns total count', () => {
    const result = detectUnused(depsA, depsB);
    expect(result.total).toBe(2);
  });

  it('returns empty report when deps are identical', () => {
    const result = detectUnused(depsA, depsA);
    expect(result.total).toBe(0);
    expect(result.unused).toHaveLength(0);
  });

  it('sorts results by name', () => {
    const result = detectUnused(depsA, depsB);
    const names = result.unused.map((e) => e.name);
    expect(names).toEqual([...names].sort());
  });
});

describe('buildUnusedReport', () => {
  it('returns a no-difference message when deps match', () => {
    const lines = buildUnusedReport(depsA, depsA);
    expect(lines[0]).toMatch(/No exclusive dependencies/);
  });

  it('includes custom labels in output', () => {
    const lines = buildUnusedReport(depsA, depsB, 'Old', 'New');
    const joined = lines.join('\n');
    expect(joined).toMatch(/only in Old/);
    expect(joined).toMatch(/only in New/);
  });

  it('includes package name and version', () => {
    const lines = buildUnusedReport(depsA, depsB);
    const joined = lines.join('\n');
    expect(joined).toContain('axios@1.2.0');
    expect(joined).toContain('date-fns@2.30.0');
  });
});
