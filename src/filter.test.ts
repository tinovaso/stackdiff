import { filterDiff, DiffEntry } from './filter';

const entries: DiffEntry[] = [
  { name: 'react', from: '17.0.0', to: '18.0.0', status: 'changed', dev: false },
  { name: 'lodash', from: '4.17.21', to: '4.17.21', status: 'unchanged', dev: false },
  { name: 'jest', from: null, to: '29.0.0', status: 'added', dev: true },
  { name: 'webpack', from: '5.0.0', to: null, status: 'removed', dev: true },
  { name: 'typescript', from: '4.0.0', to: '5.0.0', status: 'changed', dev: true },
];

describe('filterDiff', () => {
  it('returns all entries with no options', () => {
    expect(filterDiff(entries, {})).toHaveLength(5);
  });

  it('filters only changed entries', () => {
    const result = filterDiff(entries, { onlyChanged: true });
    expect(result.every((e) => e.status !== 'unchanged')).toBe(true);
    expect(result).toHaveLength(4);
  });

  it('filters devOnly', () => {
    const result = filterDiff(entries, { devOnly: true });
    expect(result.every((e) => e.dev === true)).toBe(true);
    expect(result).toHaveLength(3);
  });

  it('filters prodOnly', () => {
    const result = filterDiff(entries, { prodOnly: true });
    expect(result.every((e) => e.dev !== true)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('filters by include pattern', () => {
    const result = filterDiff(entries, { include: ['^react'] });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('react');
  });

  it('filters by exclude pattern', () => {
    const result = filterDiff(entries, { exclude: ['webpack', 'jest'] });
    expect(result.find((e) => e.name === 'webpack')).toBeUndefined();
    expect(result.find((e) => e.name === 'jest')).toBeUndefined();
  });

  it('combines onlyChanged and devOnly', () => {
    const result = filterDiff(entries, { onlyChanged: true, devOnly: true });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.name).sort()).toEqual(['jest', 'typescript'].sort());
  });
});
