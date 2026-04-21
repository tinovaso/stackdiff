import {
  isPinned,
  detectPinnedFromMap,
  detectPinnedVersions,
} from './pinnedVersionDetector';

describe('isPinned', () => {
  it('returns true for exact versions', () => {
    expect(isPinned('1.2.3')).toBe(true);
    expect(isPinned('0.0.1')).toBe(true);
    expect(isPinned('10.0.0')).toBe(true);
  });

  it('returns false for caret ranges', () => {
    expect(isPinned('^1.2.3')).toBe(false);
  });

  it('returns false for tilde ranges', () => {
    expect(isPinned('~1.2.3')).toBe(false);
  });

  it('returns false for wildcard versions', () => {
    expect(isPinned('*')).toBe(false);
    expect(isPinned('latest')).toBe(false);
    expect(isPinned('')).toBe(false);
  });

  it('returns false for gt/lt ranges', () => {
    expect(isPinned('>=1.0.0')).toBe(false);
    expect(isPinned('>2.0.0')).toBe(false);
  });
});

describe('detectPinnedFromMap', () => {
  it('returns only pinned entries', () => {
    const deps = { react: '18.2.0', lodash: '^4.17.21', express: '4.18.1' };
    const result = detectPinnedFromMap(deps, 'a');
    expect(result).toHaveLength(2);
    expect(result.map(e => e.name)).toEqual(['react', 'express']);
    expect(result.every(e => e.source === 'a')).toBe(true);
  });

  it('returns empty array when no pinned deps', () => {
    const deps = { react: '^18.0.0', lodash: '~4.0.0' };
    expect(detectPinnedFromMap(deps, 'b')).toHaveLength(0);
  });
});

describe('detectPinnedVersions', () => {
  it('marks entries present in both as "both"', () => {
    const a = { react: '18.2.0', lodash: '^4.0.0' };
    const b = { react: '18.2.0', express: '4.18.1' };
    const report = detectPinnedVersions(a, b);
    const reactEntry = report.pinned.find(e => e.name === 'react');
    expect(reactEntry?.source).toBe('both');
  });

  it('marks entries only in a as "a"', () => {
    const a = { axios: '1.4.0' };
    const b = {};
    const report = detectPinnedVersions(a, b);
    expect(report.pinned[0].source).toBe('a');
  });

  it('marks entries only in b as "b"', () => {
    const a = {};
    const b = { axios: '1.4.0' };
    const report = detectPinnedVersions(a, b);
    expect(report.pinned[0].source).toBe('b');
  });

  it('returns sorted results and correct total', () => {
    const a = { zlib: '1.0.0', axios: '1.4.0' };
    const b = { moment: '2.29.4' };
    const report = detectPinnedVersions(a, b);
    expect(report.total).toBe(3);
    expect(report.pinned.map(e => e.name)).toEqual(['axios', 'moment', 'zlib']);
  });
});
