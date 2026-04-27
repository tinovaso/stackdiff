import { detectPeerConflicts, buildPeerConflictReport } from './peerDependencyConflictDetector';

const deps = {
  react: '17.0.2',
  'react-dom': '17.0.2',
};

const peerRequirements: Record<string, Record<string, string>> = {
  'some-lib': { react: '^17.0.0' },
  'another-lib': { react: '^18.0.0' },
  'missing-lib': { 'missing-pkg': '^1.0.0' },
};

describe('detectPeerConflicts', () => {
  it('returns no conflicts when all peers are satisfied', () => {
    const result = detectPeerConflicts(deps, { 'some-lib': { react: '^17.0.0' } });
    expect(result).toHaveLength(0);
  });

  it('detects mismatch conflict', () => {
    const result = detectPeerConflicts(deps, { 'another-lib': { react: '^18.0.0' } });
    expect(result).toHaveLength(1);
    expect(result[0].conflict).toBe('mismatch');
    expect(result[0].package).toBe('react');
    expect(result[0].installedVersion).toBe('17.0.2');
  });

  it('detects missing conflict', () => {
    const result = detectPeerConflicts(deps, { 'missing-lib': { 'missing-pkg': '^1.0.0' } });
    expect(result).toHaveLength(1);
    expect(result[0].conflict).toBe('missing');
    expect(result[0].installedVersion).toBeNull();
  });

  it('detects multiple conflicts', () => {
    const result = detectPeerConflicts(deps, peerRequirements);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

describe('buildPeerConflictReport', () => {
  it('builds a report with counts', () => {
    const report = buildPeerConflictReport(deps, peerRequirements);
    expect(report.totalConflicts).toBe(report.missingCount + report.mismatchCount);
    expect(report.missingCount).toBeGreaterThanOrEqual(1);
    expect(report.mismatchCount).toBeGreaterThanOrEqual(1);
  });

  it('returns zero counts when no conflicts', () => {
    const report = buildPeerConflictReport(deps, {});
    expect(report.totalConflicts).toBe(0);
    expect(report.missingCount).toBe(0);
    expect(report.mismatchCount).toBe(0);
  });
});
