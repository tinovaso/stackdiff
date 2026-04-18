import { parseOutputFormat, validateOutputFormat } from './outputFormat';

describe('parseOutputFormat', () => {
  it('defaults to text when no flag provided', () => {
    expect(parseOutputFormat([])).toBe('text');
  });

  it('parses json format', () => {
    expect(parseOutputFormat(['--format', 'json'])).toBe('json');
  });

  it('parses markdown format', () => {
    expect(parseOutputFormat(['--format', 'markdown'])).toBe('markdown');
  });

  it('throws on invalid format', () => {
    expect(() => parseOutputFormat(['--format', 'xml'])).toThrow(
      /Invalid format/
    );
  });

  it('defaults to text when --format has no value', () => {
    expect(parseOutputFormat(['--format'])).toBe('text');
  });
});

describe('validateOutputFormat', () => {
  it('returns true for valid formats', () => {
    expect(validateOutputFormat('text')).toBe(true);
    expect(validateOutputFormat('json')).toBe(true);
    expect(validateOutputFormat('markdown')).toBe(true);
  });

  it('returns false for invalid format', () => {
    expect(validateOutputFormat('csv')).toBe(false);
  });
});
