import { format, formatAsJson, formatAsMarkdown, formatAsText } from './formatter';
import { DiffResult } from './diffEngine';

const mockDiffs: DiffResult[] = [
  { name: 'lodash', type: 'added', versionA: undefined, versionB: '4.17.21' },
  { name: 'axios', type: 'removed', versionA: '0.21.0', versionB: undefined },
  { name: 'react', type: 'changed', versionA: '17.0.0', versionB: '18.0.0' },
];

describe('formatAsText', () => {
  it('formats added packages with +', () => {
    const out = formatAsText(mockDiffs);
    expect(out).toContain('+ lodash @ 4.17.21');
  });

  it('formats removed packages with -', () => {
    const out = formatAsText(mockDiffs);
    expect(out).toContain('- axios @ 0.21.0');
  });

  it('formats changed packages with ~', () => {
    const out = formatAsText(mockDiffs);
    expect(out).toContain('~ react: 17.0.0 → 18.0.0');
  });

  it('returns no differences message for empty array', () => {
    expect(formatAsText([])).toBe('No differences found.');
  });
});

describe('formatAsJson', () => {
  it('returns valid JSON', () => {
    const out = formatAsJson(mockDiffs);
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('contains all diff entries', () => {
    const parsed = JSON.parse(formatAsJson(mockDiffs));
    expect(parsed).toHaveLength(3);
  });
});

describe('formatAsMarkdown', () => {
  it('includes markdown headings', () => {
    const out = formatAsMarkdown(mockDiffs);
    expect(out).toContain('## Added');
    expect(out).toContain('## Removed');
    expect(out).toContain('## Changed');
  });

  it('shows no differences message when empty', () => {
    const out = formatAsMarkdown([]);
    expect(out).toContain('_No differences found._');
  });
});

describe('format', () => {
  it('delegates to correct formatter', () => {
    expect(format(mockDiffs, 'json')).toEqual(formatAsJson(mockDiffs));
    expect(format(mockDiffs, 'markdown')).toEqual(formatAsMarkdown(mockDiffs));
    expect(format(mockDiffs, 'text')).toEqual(formatAsText(mockDiffs));
  });
});
