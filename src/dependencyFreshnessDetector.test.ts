import {
  classifyFreshness,
  computeFreshnessScore,
  buildFreshnessReport,
} from './dependencyFreshnessDetector';

describe('classifyFreshness', () => {
  it('returns fresh for <= 30 days', () => {
    expect(classifyFreshness(0)).toBe('fresh');
    expect(classifyFreshness(30)).toBe('fresh');
  });

  it('returns stale for 31-180 days', () => {
    expect(classifyFreshness(31)).toBe('stale');
    expect(classifyFreshness(180)).toBe('stale');
  });

  it('returns outdated for > 180 days', () => {
    expect(classifyFreshness(181)).toBe('outdated');
    expect(classifyFreshness(400)).toBe('outdated');
  });
});

describe('computeFreshnessScore', () => {
  it('returns 100 for 0 days behind', () => {
    expect(computeFreshnessScore(0)).toBe(100);
  });

  it('returns 0 for >= 365 days behind', () => {
    expect(computeFreshnessScore(365)).toBe(0);
    expect(computeFreshnessScore(400)).toBe(0);
  });

  it('returns proportional score for intermediate values', () => {
    const score = computeFreshnessScore(182);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});

describe('buildFreshnessReport', () => {
  const now = new Date();
  const recentDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const oldDate = new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString();

  const deps = { react: '17.0.0', lodash: '4.17.0' };
  const latestVersions = {
    react: { version: '18.0.0', publishedAt: recentDate },
    lodash: { version: '4.17.21', publishedAt: oldDate },
  };

  it('builds a report with correct entry count', () => {
    const report = buildFreshnessReport(deps, latestVersions);
    expect(report.entries).toHaveLength(2);
  });

  it('correctly classifies fresh and outdated entries', () => {
    const report = buildFreshnessReport(deps, latestVersions);
    const react = report.entries.find(e => e.name === 'react');
    const lodash = report.entries.find(e => e.name === 'lodash');
    expect(react?.status).toBe('fresh');
    expect(lodash?.status).toBe('outdated');
  });

  it('computes a valid averageScore', () => {
    const report = buildFreshnessReport(deps, latestVersions);
    expect(report.averageScore).toBeGreaterThanOrEqual(0);
    expect(report.averageScore).toBeLessThanOrEqual(100);
  });

  it('returns a report with zero entries when no latest versions match', () => {
    const report = buildFreshnessReport({ unknown: '1.0.0' }, latestVersions);
    expect(report.entries).toHaveLength(0);
    expect(report.averageScore).toBe(100);
  });
});
