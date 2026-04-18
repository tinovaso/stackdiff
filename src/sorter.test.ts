import { sortDiff, parseSortOptions, DiffEntry } from './sorter';

const entries: DiffEntry[] = [
  { name: 'zod', type: 'added', newVersion: '3.0.0' },
  { name: 'axios', type: 'removed', oldVersion: '1.2.0' },
  { name: 'react', type: 'changed', oldVersion: '17.0.0', newVersion: '18.0.0' },
  { name: 'lodash', type: 'unchanged', oldVersion: '4.17.21', newVersion: '4.17.21' },
];

describe('sortDiff', () => {
  it('sorts by name ascending', () => {
    const result = sortDiff(entries, { field: 'name', order: 'asc' });
    expect(result.map(e => e.name)).toEqual(['axios', 'lodash', 'react', 'zod']);
  });

  it('sorts by name descending', () => {
    const result = sortDiff(entries, { field: 'name', order: 'desc' });
    expect(result.map(e => e.name)).toEqual(['zod', 'react', 'lodash', 'axios']);
  });

  it('sorts by type ascending', () => {
    const result = sortDiff(entries, { field: 'type', order: 'asc' });
    expect(result[0].type).toBe('added');
  });

  it('sorts by version ascending', () => {
    const result = sortDiff(entries, { field: 'version', order: 'asc' });
    expect(result[0].newVersion ?? result[0].oldVersion).toBeDefined();
  });

  it('does not mutate original array', () => {
    const copy = [...entries];
    sortDiff(entries, { field: 'name', order: 'asc' });
    expect(entries).toEqual(copy);
  });
});

describe('parseSortOptions', () => {
  it('parses --sort and --sort-order', () => {
    const opts = parseSortOptions(['--sort', 'type', '--sort-order', 'desc']);
    expect(opts).toEqual({ field: 'type', order: 'desc' });
  });

  it('defaults to name asc', () => {
    const opts = parseSortOptions([]);
    expect(opts).toEqual({ field: 'name', order: 'asc' });
  });

  it('falls back to defaults for invalid values', () => {
    const opts = parseSortOptions(['--sort', 'invalid', '--sort-order', 'sideways']);
    expect(opts).toEqual({ field: 'name', order: 'asc' });
  });
});
