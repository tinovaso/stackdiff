import { parseFilterOptions } from './filterOptions';

describe('parseFilterOptions', () => {
  it('returns empty options for empty args', () => {
    expect(parseFilterOptions({})).toEqual({});
  });

  it('parses onlyChanged flag', () => {
    expect(parseFilterOptions({ onlyChanged: true })).toMatchObject({ onlyChanged: true });
  });

  it('parses devOnly flag', () => {
    expect(parseFilterOptions({ devOnly: true })).toMatchObject({ devOnly: true });
  });

  it('parses prodOnly flag', () => {
    expect(parseFilterOptions({ prodOnly: true })).toMatchObject({ prodOnly: true });
  });

  it('parses comma-separated include list', () => {
    const result = parseFilterOptions({ include: 'react, lodash, ^type' });
    expect(result.include).toEqual(['react', 'lodash', '^type']);
  });

  it('parses comma-separated exclude list', () => {
    const result = parseFilterOptions({ exclude: 'jest,webpack' });
    expect(result.exclude).toEqual(['jest', 'webpack']);
  });

  it('parses single-item include list', () => {
    const result = parseFilterOptions({ include: 'react' });
    expect(result.include).toEqual(['react']);
  });

  it('trims whitespace from exclude list entries', () => {
    const result = parseFilterOptions({ exclude: ' jest , webpack ' });
    expect(result.exclude).toEqual(['jest', 'webpack']);
  });

  it('throws when devOnly and prodOnly are both set', () => {
    expect(() =>
      parseFilterOptions({ devOnly: true, prodOnly: true })
    ).toThrow('Cannot use --dev-only and --prod-only together');
  });
});
