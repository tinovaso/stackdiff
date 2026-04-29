import {
  formatMissingPeerReportAsText,
  formatMissingPeerReportAsMarkdown,
  formatMissingPeerReport,
} from './missingPeerFormatter';
import { MissingPeerReport } from './missingPeerDetector';

const emptyReport: MissingPeerReport = { missing: [], total: 0 };

const sampleReport: MissingPeerReport = {
  total: 2,
  missing: [
    { package: 'react-dom', requiredBy: 'react', requiredRange: '^18.0.0', installedVersion: null },
    { package: 'styled-components', requiredBy: 'ui-lib', requiredRange: '>=5.0.0', installedVersion: null },
  ],
};

describe('formatMissingPeerReportAsText', () => {
  it('returns a no-issue message for empty report', () => {
    const output = formatMissingPeerReportAsText(emptyReport);
    expect(output).toContain('No missing peer dependencies');
  });

  it('includes count in header', () => {
    const output = formatMissingPeerReportAsText(sampleReport);
    expect(output).toContain('(2)');
  });

  it('lists each missing package', () => {
    const output = formatMissingPeerReportAsText(sampleReport);
    expect(output).toContain('react-dom');
    expect(output).toContain('styled-components');
    expect(output).toContain('required by react');
  });
});

describe('formatMissingPeerReportAsMarkdown', () => {
  it('returns italic message for empty report', () => {
    const output = formatMissingPeerReportAsMarkdown(emptyReport);
    expect(output).toContain('_No missing');
  });

  it('renders a markdown table', () => {
    const output = formatMissingPeerReportAsMarkdown(sampleReport);
    expect(output).toContain('| Package |');
    expect(output).toContain('react-dom');
    expect(output).toContain('styled-components');
  });
});

describe('formatMissingPeerReport', () => {
  it('defaults to text format', () => {
    const output = formatMissingPeerReport(sampleReport);
    expect(output).toContain('Missing Peer Dependencies');
    expect(output).not.toContain('##');
  });

  it('uses markdown when specified', () => {
    const output = formatMissingPeerReport(sampleReport, 'markdown');
    expect(output).toContain('##');
  });
});
