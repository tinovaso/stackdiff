import {
  detectResolutionConflicts,
  buildResolutionConflictReport,
} from './resolutionConflictDetector';
import {
  formatResolutionConflictReportAsText,
  formatResolutionConflictReportAsMarkdown,
} from './resolutionConflictFormatter';

const mapA = { react: '17.0.2', lodash: '4.17.21', axios: '0.21.1' };
const mapB = { react: '18.2.0', lodash: '4.17.21', axios: '1.4.0' };

describe('detectResolutionConflicts', () => {
  it('detects packages with differing versions', () => {
    const report = detectResolutionConflicts(mapA, mapB);
    expect(report.hasConflicts).toBe(true);
    expect(report.totalConflicts).toBe(2);
    const names = report.conflicts.map((c) => c.packageName);
    expect(names).toContain('react');
    expect(names).toContain('axios');
  });

  it('does not flag packages with identical versions', () => {
    const report = detectResolutionConflicts(mapA, mapB);
    const names = report.conflicts.map((c) => c.packageName);
    expect(names).not.toContain('lodash');
  });

  it('returns no conflicts when maps are identical', () => {
    const report = detectResolutionConflicts(mapA, mapA);
    expect(report.hasConflicts).toBe(false);
    expect(report.totalConflicts).toBe(0);
  });

  it('uses provided source labels', () => {
    const report = detectResolutionConflicts(mapA, mapB, 'old', 'new');
    const conflict = report.conflicts.find((c) => c.packageName === 'react')!;
    expect(conflict.sources).toEqual(['old', 'new']);
  });

  it('sorts conflicts alphabetically', () => {
    const report = detectResolutionConflicts(mapA, mapB);
    const names = report.conflicts.map((c) => c.packageName);
    expect(names).toEqual([...names].sort());
  });
});

describe('buildResolutionConflictReport', () => {
  it('delegates to detectResolutionConflicts', () => {
    const report = buildResolutionConflictReport(mapA, mapB, 'a', 'b');
    expect(report.totalConflicts).toBe(2);
  });
});

describe('formatResolutionConflictReportAsText', () => {
  it('includes package names and versions', () => {
    const report = detectResolutionConflicts(mapA, mapB);
    const text = formatResolutionConflictReportAsText(report);
    expect(text).toContain('react');
    expect(text).toContain('17.0.2');
    expect(text).toContain('18.2.0');
  });

  it('returns friendly message when no conflicts', () => {
    const report = detectResolutionConflicts(mapA, mapA);
    expect(formatResolutionConflictReportAsText(report)).toContain('No resolution conflicts');
  });
});

describe('formatResolutionConflictReportAsMarkdown', () => {
  it('renders a markdown table', () => {
    const report = detectResolutionConflicts(mapA, mapB);
    const md = formatResolutionConflictReportAsMarkdown(report);
    expect(md).toContain('|');
    expect(md).toContain('react');
  });

  it('returns italic message when no conflicts', () => {
    const report = detectResolutionConflicts(mapA, mapA);
    expect(formatResolutionConflictReportAsMarkdown(report)).toContain('_No resolution');
  });
});
