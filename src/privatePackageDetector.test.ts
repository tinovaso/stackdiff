import { isPrivatePackage, detectPrivatePackages } from './privatePackageDetector';
import { DiffEntry } from './diffEngine';

describe('isPrivatePackage', () => {
  it('detects file: protocol', () => {
    expect(isPrivatePackage('file:../my-lib')).toBe(true);
  });

  it('detects link: protocol', () => {
    expect(isPrivatePackage('link:./packages/ui')).toBe(true);
  });

  it('detects git+ protocol', () => {
    expect(isPrivatePackage('git+https://github.com/org/repo.git')).toBe(true);
  });

  it('detects github: shorthand', () => {
    expect(isPrivatePackage('github:org/repo#main')).toBe(true);
  });

  it('detects owner/repo shorthand', () => {
    expect(isPrivatePackage('org/my-repo')).toBe(true);
  });

  it('returns false for regular semver', () => {
    expect(isPrivatePackage('^1.2.3')).toBe(false);
    expect(isPrivatePackage('1.0.0')).toBe(false);
    expect(isPrivatePackage('~2.0.0')).toBe(false);
  });
});

describe('detectPrivatePackages', () => {
  const diff: DiffEntry[] = [
    { name: 'my-lib', type: 'added', from: undefined, to: 'file:../my-lib' },
    { name: 'lodash', type: 'changed', from: '4.17.20', to: '4.17.21' },
  ];

  const deps: Record<string, string> = {
    'my-lib': 'file:../my-lib',
    lodash: '4.17.21',
    'internal-ui': 'git+https://github.com/acme/ui.git',
  };

  it('detects private packages from deps', () => {
    const report = detectPrivatePackages(diff, deps);
    expect(report.total).toBe(2);
    expect(report.entries.map((e) => e.name)).toContain('my-lib');
    expect(report.entries.map((e) => e.name)).toContain('internal-ui');
  });

  it('assigns correct side for added entry', () => {
    const report = detectPrivatePackages(diff, deps);
    const entry = report.entries.find((e) => e.name === 'my-lib');
    expect(entry?.side).toBe('added');
  });

  it('assigns both for packages not in diff', () => {
    const report = detectPrivatePackages(diff, deps);
    const entry = report.entries.find((e) => e.name === 'internal-ui');
    expect(entry?.side).toBe('both');
  });

  it('returns empty report when no private packages', () => {
    const report = detectPrivatePackages([], { lodash: '4.17.21' });
    expect(report.total).toBe(0);
    expect(report.entries).toHaveLength(0);
  });
});
