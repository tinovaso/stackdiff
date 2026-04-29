import { detectMissingPeers, buildMissingPeerReport } from './missingPeerDetector';
import { PackageJson } from './packageParser';

const makePackage = (name: string, peerDependencies: Record<string, string>): PackageJson => ({
  name,
  version: '1.0.0',
  dependencies: {},
  devDependencies: {},
  peerDependencies,
});

describe('detectMissingPeers', () => {
  it('returns empty when all peers are installed', () => {
    const packages = { react: makePackage('react', { 'react-dom': '^18.0.0' }) };
    const installed = { 'react-dom': '18.2.0' };
    const result = detectMissingPeers(packages, installed);
    expect(result.total).toBe(0);
    expect(result.missing).toHaveLength(0);
  });

  it('detects a missing peer dependency', () => {
    const packages = { react: makePackage('react', { 'react-dom': '^18.0.0' }) };
    const installed = {};
    const result = detectMissingPeers(packages, installed);
    expect(result.total).toBe(1);
    expect(result.missing[0].package).toBe('react-dom');
    expect(result.missing[0].requiredBy).toBe('react');
    expect(result.missing[0].requiredRange).toBe('^18.0.0');
    expect(result.missing[0].installedVersion).toBeNull();
  });

  it('detects multiple missing peers across packages', () => {
    const packages = {
      alpha: makePackage('alpha', { beta: '^1.0.0', gamma: '^2.0.0' }),
      delta: makePackage('delta', { epsilon: '>=3.0.0' }),
    };
    const installed = { gamma: '2.1.0' };
    const result = detectMissingPeers(packages, installed);
    expect(result.total).toBe(2);
    const names = result.missing.map((e) => e.package);
    expect(names).toContain('beta');
    expect(names).toContain('epsilon');
    expect(names).not.toContain('gamma');
  });

  it('returns no missing peers when peerDependencies is absent', () => {
    const packages = { foo: makePackage('foo', {}) };
    const installed = {};
    const result = detectMissingPeers(packages, installed);
    expect(result.total).toBe(0);
  });
});

describe('buildMissingPeerReport', () => {
  it('delegates to detectMissingPeers', () => {
    const packages = { lib: makePackage('lib', { peer: '^1.0.0' }) };
    const installed = {};
    const report = buildMissingPeerReport(packages, installed);
    expect(report.total).toBe(1);
  });
});
