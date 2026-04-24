import { isAlias, parseAlias, detectAliases } from './packageAliasDetector';

describe('isAlias', () => {
  it('returns true for npm: prefixed versions', () => {
    expect(isAlias('npm:lodash@^4.0.0')).toBe(true);
  });

  it('returns false for normal semver', () => {
    expect(isAlias('^1.2.3')).toBe(false);
    expect(isAlias('1.0.0')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isAlias('')).toBe(false);
  });
});

describe('parseAlias', () => {
  it('parses a valid alias entry', () => {
    const result = parseAlias('myLodash', 'npm:lodash@^4.17.0');
    expect(result).toEqual({
      alias: 'myLodash',
      resolvedPackage: 'lodash',
      version: '^4.17.0',
    });
  });

  it('handles scoped packages', () => {
    const result = parseAlias('myUtils', 'npm:@scope/utils@1.0.0');
    expect(result).toEqual({
      alias: 'myUtils',
      resolvedPackage: '@scope/utils',
      version: '1.0.0',
    });
  });

  it('returns null for non-alias version', () => {
    expect(parseAlias('lodash', '^4.0.0')).toBeNull();
  });

  it('returns null for malformed npm: prefix', () => {
    expect(parseAlias('foo', 'npm:noatsign')).toBeNull();
  });
});

describe('detectAliases', () => {
  it('detects aliases in a flat dependency map', () => {
    const deps = {
      lodash: '^4.17.0',
      myLodash: 'npm:lodash@^4.17.0',
      react: '18.0.0',
      myReact: 'npm:react@^17.0.0',
    };
    const report = detectAliases(deps);
    expect(report.totalCount).toBe(2);
    expect(report.aliases).toHaveLength(2);
    expect(report.aliases[0].alias).toBe('myLodash');
    expect(report.aliases[1].alias).toBe('myReact');
  });

  it('returns empty report when no aliases present', () => {
    const deps = { lodash: '^4.0.0', react: '18.0.0' };
    const report = detectAliases(deps);
    expect(report.totalCount).toBe(0);
    expect(report.aliases).toHaveLength(0);
  });
});
