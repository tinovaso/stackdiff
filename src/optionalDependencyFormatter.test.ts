import { formatOptionalReport, formatOptionalReportAsText, formatOptionalReportAsMarkdown } from './optionalDependencyFormatter';
import { OptionalDependencyReport } from './optionalDependencyDetector';

const emptyReport: OptionalDependencyReport = { entries: [] };

const sampleReport: OptionalDependencyReport = {
  entries: [
    { name: 'fsevents', versionA: undefined, versionB: '2.3.2', status: 'added', side: 'b' },
    { name: 'bufferutil', versionA: '4.0.7', versionB: undefined, status: 'removed', side: 'a' },
    { name: 'utf-8-validate', versionA: '5.0.9', versionB: '6.0.0', status: 'changed', side: 'b' },
  ],
};

describe('formatOptionalReportAsText', () => {
  it('returns no-diff message for empty report', () => {
    expect(formatOptionalReportAsText(emptyReport)).toBe('No optional dependency differences found.');
  });

  it('formats added entry', () => {
    const result = formatOptionalReportAsText(sampleReport);
    expect(result).toContain('+ fsevents@2.3.2');
  });

  it('formats removed entry', () => {
    const result = formatOptionalReportAsText(sampleReport);
    expect(result).toContain('- bufferutil@4.0.7');
  });

  it('formats changed entry', () => {
    const result = formatOptionalReportAsText(sampleReport);
    expect(result).toContain('~ utf-8-validate: 5.0.9 → 6.0.0');
  });
});

describe('formatOptionalReportAsMarkdown', () => {
  it('returns italic message for empty report', () => {
    expect(formatOptionalReportAsMarkdown(emptyReport)).toBe('_No optional dependency differences found._');
  });

  it('includes markdown table header', () => {
    const result = formatOptionalReportAsMarkdown(sampleReport);
    expect(result).toContain('| Package | Version A | Version B | Status | Side |');
  });

  it('formats rows correctly', () => {
    const result = formatOptionalReportAsMarkdown(sampleReport);
    expect(result).toContain('`fsevents`');
    expect(result).toContain('added');
    expect(result).toContain('removed');
    expect(result).toContain('changed');
  });
});

describe('formatOptionalReport', () => {
  it('delegates to text formatter', () => {
    expect(formatOptionalReport(emptyReport, 'text')).toBe(formatOptionalReportAsText(emptyReport));
  });

  it('delegates to markdown formatter', () => {
    expect(formatOptionalReport(sampleReport, 'markdown')).toBe(formatOptionalReportAsMarkdown(sampleReport));
  });
});
