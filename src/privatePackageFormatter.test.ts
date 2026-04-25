import {
  formatPrivateReportAsText,
  formatPrivateReportAsMarkdown,
  formatPrivateReport,
} from './privatePackageFormatter';
import { PrivatePackageReport } from './privatePackageDetector';

const emptyReport: PrivatePackageReport = { entries: [], total: 0 };

const report: PrivatePackageReport = {
  total: 2,
  entries: [
    { name: 'my-lib', version: 'file:../my-lib', side: 'added' },
    { name: 'internal-ui', version: 'git+https://github.com/acme/ui.git', side: 'both' },
  ],
};

describe('formatPrivateReportAsText', () => {
  it('returns no-packages message for empty report', () => {
    expect(formatPrivateReportAsText(emptyReport)).toBe(
      'No private/local packages detected.'
    );
  });

  it('includes total count in header', () => {
    const output = formatPrivateReportAsText(report);
    expect(output).toContain('Private/local packages (2)');
  });

  it('includes package names and versions', () => {
    const output = formatPrivateReportAsText(report);
    expect(output).toContain('my-lib@file:../my-lib');
    expect(output).toContain('[added]');
    expect(output).toContain('internal-ui');
    expect(output).toContain('[both]');
  });
});

describe('formatPrivateReportAsMarkdown', () => {
  it('returns italic message for empty report', () => {
    expect(formatPrivateReportAsMarkdown(emptyReport)).toBe(
      '_No private/local packages detected._'
    );
  });

  it('includes markdown table headers', () => {
    const output = formatPrivateReportAsMarkdown(report);
    expect(output).toContain('| Package |');
    expect(output).toContain('| Version |');
    expect(output).toContain('| Side |');
  });

  it('formats entries as table rows', () => {
    const output = formatPrivateReportAsMarkdown(report);
    expect(output).toContain('`my-lib`');
    expect(output).toContain('[added]');
  });
});

describe('formatPrivateReport', () => {
  it('defaults to text format', () => {
    const output = formatPrivateReport(report);
    expect(output).toContain('Private/local packages (2)');
  });

  it('uses markdown when specified', () => {
    const output = formatPrivateReport(report, 'markdown');
    expect(output).toContain('##');
  });
});
