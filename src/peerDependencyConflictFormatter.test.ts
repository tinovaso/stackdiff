import { formatPeerConflictReport, formatPeerConflictReportAsText, formatPeerConflictReportAsMarkdown } from './peerDependencyConflictFormatter';
import { PeerConflictReport } from './peerDependencyConflictDetector';

const emptyReport: PeerConflictReport = { conflicts: [], totalConflicts: 0, missingCount: 0, mismatchCount: 0 };

const report: PeerConflictReport = {
  conflicts: [
    { package: 'react', requiredBy: 'some-lib', requiredRange: '^18.0.0', installedVersion: '17.0.2', conflict: 'mismatch' },
    { package: 'lodash', requiredBy: 'other-lib', requiredRange: '^4.0.0', installedVersion: null, conflict: 'missing' },
  ],
  totalConflicts: 2,
  missingCount: 1,
  mismatchCount: 1,
};

describe('formatPeerConflictReportAsText', () => {
  it('returns friendly message when no conflicts', () => {
    const out = formatPeerConflictReportAsText(emptyReport);
    expect(out).toContain('No peer dependency conflicts');
  });

  it('includes conflict summary counts', () => {
    const out = formatPeerConflictReportAsText(report);
    expect(out).toContain('2');
    expect(out).toContain('missing: 1');
    expect(out).toContain('mismatch: 1');
  });

  it('shows mismatch symbol for mismatch conflicts', () => {
    const out = formatPeerConflictReportAsText(report);
    expect(out).toContain('⚠');
  });

  it('shows missing symbol for missing conflicts', () => {
    const out = formatPeerConflictReportAsText(report);
    expect(out).toContain('✗');
  });
});

describe('formatPeerConflictReportAsMarkdown', () => {
  it('returns italic message when no conflicts', () => {
    const out = formatPeerConflictReportAsMarkdown(emptyReport);
    expect(out).toContain('_No peer dependency conflicts');
  });

  it('includes a markdown table', () => {
    const out = formatPeerConflictReportAsMarkdown(report);
    expect(out).toContain('|');
    expect(out).toContain('react');
    expect(out).toContain('lodash');
  });
});

describe('formatPeerConflictReport', () => {
  it('defaults to text format', () => {
    const out = formatPeerConflictReport(report);
    expect(out).not.toContain('|');
  });

  it('uses markdown when specified', () => {
    const out = formatPeerConflictReport(report, 'markdown');
    expect(out).toContain('|');
  });
});
