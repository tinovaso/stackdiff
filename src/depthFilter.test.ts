import { getPackageDepth, parseDepthFilterOptions, filterByDepth } from './depthFilter';
import { DiffEntry } from './diffEngine';

const makEntry = (name: string, type: DiffEntry['type'] = 'changed'): DiffEntry => ({
  name,
  type,
  oldVersion: '1.0.0',
  newVersion: '2.0.0',
});

describe('getPackageDepth', () => {
  it('returns 1 for top-level package', () => {
    expect(getPackageDepth('react')).toBe(1);
  });

  it('returns 2 for one level nested', () => {
    expect(getPackageDepth('react>prop-types')).toBe(2);
  });

  it('returns 3 for two levels nested', () => {
    expect(getPackageDepth('a>b>c')).toBe(3);
  });

  it('returns 0 for empty string', () => {
    expect(getPackageDepth('')).toBe(0);
  });
});

describe('parseDepthFilterOptions', () => {
  it('parses --max-depth', () => {
    expect(parseDepthFilterOptions(['--max-depth', '2'])).toEqual({ maxDepth: 2 });
  });

  it('parses --min-depth', () => {
    expect(parseDepthFilterOptions(['--min-depth', '1'])).toEqual({ minDepth: 1 });
  });

  it('parses both options', () => {
    expect(parseDepthFilterOptions(['--min-depth', '1', '--max-depth', '3'])).toEqual({
      minDepth: 1,
      maxDepth: 3,
    });
  });

  it('ignores invalid values', () => {
    expect(parseDepthFilterOptions(['--max-depth', 'abc'])).toEqual({});
  });

  it('returns empty object for no args', () => {
    expect(parseDepthFilterOptions([])).toEqual({});
  });
});

describe('filterByDepth', () => {
  const entries = [
    makEntry('react'),
    makEntry('react>prop-types'),
    makEntry('a>b>c'),
  ];

  it('filters by maxDepth', () => {
    const result = filterByDepth(entries, { maxDepth: 1 });
    expect(result.map((e) => e.name)).toEqual(['react']);
  });

  it('filters by minDepth', () => {
    const result = filterByDepth(entries, { minDepth: 2 });
    expect(result.map((e) => e.name)).toEqual(['react>prop-types', 'a>b>c']);
  });

  it('filters by both min and max depth', () => {
    const result = filterByDepth(entries, { minDepth: 2, maxDepth: 2 });
    expect(result.map((e) => e.name)).toEqual(['react>prop-types']);
  });

  it('returns all when no options set', () => {
    expect(filterByDepth(entries, {})).toHaveLength(3);
  });
});
