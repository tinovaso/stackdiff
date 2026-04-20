import { classifyVersionChange, groupDiffBySemver } from './semverGroup';

describe('classifyVersionChange', () => {
  it('classifies major version bumps', () => {
    expect(classifyVersionChange('1.2.3', '2.0.0')).toBe('major');
  });

  it('classifies minor version bumps', () => {
    expect(classifyVersionChange('1.2.3', '1.3.0')).toBe('minor');
  });

  it('classifies patch version bumps', () => {
    expect(classifyVersionChange('1.2.3', '1.2.4')).toBe('patch');
  });

  it('classifies prerelease versions', () => {
    expect(classifyVersionChange('1.2.3', '1.2.4-alpha.1')).toBe('prerelease');
  });

  it('returns unknown for non-semver strings', () => {
    expect(classifyVersionChange('latest', 'next')).toBe('unknown');
  });

  it('handles caret and tilde prefixes', () => {
    expect(classifyVersionChange('^1.2.3', '^2.0.0')).toBe('major');
    expect(classifyVersionChange('~1.2.3', '~1.3.0')).toBe('minor');
  });
});

describe('groupDiffBySemver', () => {
  const diff = {
    react: { type: 'changed', from: '17.0.0', to: '18.0.0' },
    lodash: { type: 'changed', from: '4.17.20', to: '4.17.21' },
    axios: { type: 'changed', from: '0.21.0', to: '0.22.0' },
    express: { type: 'added', to: '4.18.0' },
  };

  it('groups changed deps by semver type', () => {
    const result = groupDiffBySemver(diff, { groupBy: ['major', 'minor', 'patch'] });
    expect(result.get('major')).toHaveLength(1);
    expect(result.get('major')![0].name).toBe('react');
    expect(result.get('patch')).toHaveLength(1);
    expect(result.get('patch')![0].name).toBe('lodash');
  });

  it('excludes non-changed entries', () => {
    const result = groupDiffBySemver(diff, { groupBy: ['major', 'minor', 'patch'] });
    const allNames = [...result.values()].flat().map((r) => r.name);
    expect(allNames).not.toContain('express');
  });

  it('respects groupBy filter', () => {
    const result = groupDiffBySemver(diff, { groupBy: ['major'] });
    expect(result.has('minor')).toBe(false);
    expect(result.has('patch')).toBe(false);
  });
});
