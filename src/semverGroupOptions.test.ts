import { parseSemverGroupOptions } from './semverGroupOptions';

describe('parseSemverGroupOptions', () => {
  it('returns default groups when no args provided', () => {
    const opts = parseSemverGroupOptions([]);
    expect(opts.groupBy).toEqual(['major', 'minor', 'patch']);
  });

  it('parses a single group type', () => {
    const opts = parseSemverGroupOptions(['--group-by', 'major']);
    expect(opts.groupBy).toEqual(['major']);
  });

  it('parses multiple group types', () => {
    const opts = parseSemverGroupOptions(['--group-by', 'major,prerelease']);
    expect(opts.groupBy).toEqual(['major', 'prerelease']);
  });

  it('throws when --group-by has no value', () => {
    expect(() => parseSemverGroupOptions(['--group-by'])).toThrow('--group-by requires a value');
  });

  it('throws on invalid group type', () => {
    expect(() => parseSemverGroupOptions(['--group-by', 'breaking'])).toThrow('Invalid group-by values');
  });

  it('ignores unrelated args', () => {
    const opts = parseSemverGroupOptions(['--output', 'json', '--group-by', 'patch']);
    expect(opts.groupBy).toEqual(['patch']);
  });
});
