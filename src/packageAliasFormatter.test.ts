import { formatAliasReport, formatAliasReportAsText, formatAliasReportAsMarkdown } from './packageAliasFormatter';
import { AliasReport } from './packageAliasDetector';

const emptyReport: AliasReport = { aliases: [], totalCount: 0 };

const sampleReport: AliasReport = {
  totalCount: 2,
  aliases: [
    { alias: 'myLodash', resolvedPackage: 'lodash', version: '^4.17.0' },
    { alias: 'myUtils', resolvedPackage: '@scope/utils', version: '1.0.0' },
  ],
};

describe('formatAliasReportAsText', () => {
  it('returns no-alias message for empty report', () => {
    expect(formatAliasReportAsText(emptyReport)).toBe('No package aliases detected.');
  });

  it('formats aliases with arrow notation', () => {
    const output = formatAliasReportAsText(sampleReport);
    expect(output).toContain('Package Aliases (2 found)');
    expect(output).toContain('myLodash → lodash@^4.17.0');
    expect(output).toContain('myUtils → @scope/utils@1.0.0');
  });
});

describe('formatAliasReportAsMarkdown', () => {
  it('returns italic no-alias message for empty report', () => {
    expect(formatAliasReportAsMarkdown(emptyReport)).toBe('_No package aliases detected._');
  });

  it('formats aliases as markdown table', () => {
    const output = formatAliasReportAsMarkdown(sampleReport);
    expect(output).toContain('## Package Aliases (2 found)');
    expect(output).toContain('| Alias | Resolved Package | Version |');
    expect(output).toContain('`myLodash`');
    expect(output).toContain('`lodash`');
    expect(output).toContain('`^4.17.0`');
  });
});

describe('formatAliasReport', () => {
  it('defaults to text format', () => {
    const output = formatAliasReport(sampleReport);
    expect(output).toContain('→');
  });

  it('uses markdown when specified', () => {
    const output = formatAliasReport(sampleReport, 'markdown');
    expect(output).toContain('##');
    expect(output).toContain('|');
  });
});
