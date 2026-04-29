import { parseOptionalDependencyOptions, optionalDependencyHelp } from './optionalDependencyOptions';

describe('parseOptionalDependencyOptions', () => {
  it('returns defaults when no args provided', () => {
    const opts = parseOptionalDependencyOptions({});
    expect(opts.format).toBe('text');
    expect(opts.includeUnchanged).toBe(false);
    expect(opts.sideFilter).toBe('all');
  });

  it('parses format as markdown', () => {
    const opts = parseOptionalDependencyOptions({ 'optional-format': 'markdown' });
    expect(opts.format).toBe('markdown');
  });

  it('parses side filter as a', () => {
    const opts = parseOptionalDependencyOptions({ 'optional-side': 'a' });
    expect(opts.sideFilter).toBe('a');
  });

  it('parses side filter as b', () => {
    const opts = parseOptionalDependencyOptions({ 'optional-side': 'b' });
    expect(opts.sideFilter).toBe('b');
  });

  it('parses includeUnchanged flag', () => {
    const opts = parseOptionalDependencyOptions({ 'optional-include-unchanged': true });
    expect(opts.includeUnchanged).toBe(true);
  });

  it('throws on invalid format', () => {
    expect(() => parseOptionalDependencyOptions({ 'optional-format': 'csv' })).toThrow(
      'Invalid --optional-format value'
    );
  });

  it('throws on invalid side filter', () => {
    expect(() => parseOptionalDependencyOptions({ 'optional-side': 'both' })).toThrow(
      'Invalid --optional-side value'
    );
  });
});

describe('optionalDependencyHelp', () => {
  it('contains flag documentation', () => {
    expect(optionalDependencyHelp).toContain('--optional-format');
    expect(optionalDependencyHelp).toContain('--optional-side');
    expect(optionalDependencyHelp).toContain('--optional-include-unchanged');
  });
});
