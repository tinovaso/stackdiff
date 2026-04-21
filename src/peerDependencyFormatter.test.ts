import { formatPeerReportAsText, formatPeerReportAsMarkdown, formatPeerReport } from './peerDependencyFormatter';
import { PeerDependencyReport } from './peerDependencyChecker';

const sampleReport: PeerDependencyReport = {
  issues: [
    { package: 'react', peerDep: 'react', requiredRange: '^18.0.0', resolvedVersion: '18.2.0', status: 'satisfied' },
    { package: 'lodash', peerDep: 'lodash', requiredRange: '^4.0.0', resolvedVersion: null, status: 'missing' },
    { package: 'typescript', peerDep: 'typescript', requiredRange: '^5.0.0', resolvedVersion: '4.9.5', status: 'incompatible' },
  ],
  totalSatisfied: 1,
  totalIncompatible: 1,
  totalMissing: 1,
};

describe('formatPeerReportAsText', () => {
  it('includes header', () => {
    const out = formatPeerReportAsText(sampleReport);
    expect(out).toContain('Peer Dependency Check');
  });

  it('shows satisfied entry', () => {
    const out = formatPeerReportAsText(sampleReport);
    expect(out).toContain('✓ OK');
    expect(out).toContain('react');
  });

  it('shows missing entry', () => {
    const out = formatPeerReportAsText(sampleReport);
    expect(out).toContain('✗ MISSING');
    expect(out).toContain('not installed');
  });

  it('shows incompatible entry', () => {
    const out = formatPeerReportAsText(sampleReport);
    expect(out).toContain('⚠ INCOMPATIBLE');
  });

  it('includes summary line', () => {
    const out = formatPeerReportAsText(sampleReport);
    expect(out).toContain('1 satisfied, 1 incompatible, 1 missing');
  });

  it('handles empty report', () => {
    const empty: PeerDependencyReport = { issues: [], totalMissing: 0, totalIncompatible: 0, totalSatisfied: 0 };
    expect(formatPeerReportAsText(empty)).toContain('No peer dependencies');
  });
});

describe('formatPeerReportAsMarkdown', () => {
  it('produces markdown table', () => {
    const out = formatPeerReportAsMarkdown(sampleReport);
    expect(out).toContain('| Package |');
    expect(out).toContain('`react`');
  });

  it('handles empty report', () => {
    const empty: PeerDependencyReport = { issues: [], totalMissing: 0, totalIncompatible: 0, totalSatisfied: 0 };
    expect(formatPeerReportAsMarkdown(empty)).toContain('_No peer dependencies');
  });
});

describe('formatPeerReport', () => {
  it('delegates to text formatter', () => {
    expect(formatPeerReport(sampleReport, 'text')).toContain('Peer Dependency Check');
  });

  it('delegates to markdown formatter', () => {
    expect(formatPeerReport(sampleReport, 'markdown')).toContain('##');
  });
});
