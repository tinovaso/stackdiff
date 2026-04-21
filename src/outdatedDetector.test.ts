import { detectOutdated, OutdatedReport } from './outdatedDetector';
import { DiffEntry } from './diffEngine';

const entries: DiffEntry[] = [
  { name: 'lodash', versionA: '4.17.20', versionB: '4.17.21', status: 'changed' },
  { name: 'react', versionA: '17.0.0', versionB: '17.0.2', status: 'changed' },
  { name: 'typescript', versionA: '4.0.0', versionB: '5.0.0', status: 'changed' },
  { name: 'axios', versionA: '1.2.0', versionB: '1.3.0', status: 'changed' },
  { name: 'express', versionA: '4.18.0', versionB: undefined, status: 'removed' },
];

const latestVersions: Record<string, string> = {
  lodash: '4.17.21',
  react: '18.2.0',
  typescript: '5.4.0',
  axios: '1.3.0',
};

describe('detectOutdated', () => {
  let report: OutdatedReport;

  beforeEach(() => {
    report = detectOutdated(entries, latestVersions);
  });

  it('detects packages that are behind the latest version', () => {
    const names = report.entries.map(e => e.name);
    expect(names).toContain('react');
    expect(names).toContain('typescript');
  });

  it('does not include packages already at latest', () => {
    const names = report.entries.map(e => e.name);
    expect(names).not.toContain('lodash');
    expect(names).not.toContain('axios');
  });

  it('skips packages with no latest version data', () => {
    const names = report.entries.map(e => e.name);
    expect(names).not.toContain('express');
  });

  it('classifies react upgrade as major', () => {
    const reactEntry = report.entries.find(e => e.name === 'react');
    expect(reactEntry?.type).toBe('major');
  });

  it('classifies typescript upgrade as major', () => {
    const tsEntry = report.entries.find(e => e.name === 'typescript');
    expect(tsEntry?.type).toBe('major');
  });

  it('returns correct totals', () => {
    expect(report.total).toBe(2);
    expect(report.majorCount).toBe(2);
    expect(report.minorCount).toBe(0);
    expect(report.patchCount).toBe(0);
  });

  it('returns empty report when no packages are outdated', () => {
    const r = detectOutdated(entries, { lodash: '4.17.21', axios: '1.3.0' });
    expect(r.total).toBe(0);
    expect(r.entries).toHaveLength(0);
  });
});
