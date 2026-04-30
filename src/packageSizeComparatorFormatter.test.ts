import { compareSizes } from './packageSizeComparator';
import {
  formatSizeReport,
  formatSizeReportAsMarkdown,
  formatSizeReportAsText,
} from './packageSizeComparatorFormatter';

const mapA = { react: '17.0.2', lodash: '4.17.21' };
const mapB = { react: '18.2.0', axios: '1.4.0' };
const report = compareSizes(mapA, mapB);

describe('formatSizeReportAsText', () => {
  it('includes header', () => {
    const output = formatSizeReportAsText(report);
    expect(output).toContain('Package Size Comparison');
  });

  it('lists all packages', () => {
    const output = formatSizeReportAsText(report);
    expect(output).toContain('react');
    expect(output).toContain('lodash');
    expect(output).toContain('axios');
  });

  it('includes total line', () => {
    const output = formatSizeReportAsText(report);
    expect(output).toContain('Total:');
  });

  it('shows dash for missing size', () => {
    const output = formatSizeReportAsText(report);
    expect(output).toContain('—');
  });
});

describe('formatSizeReportAsMarkdown', () => {
  it('includes markdown table header', () => {
    const output = formatSizeReportAsMarkdown(report);
    expect(output).toContain('| Package |');
    expect(output).toContain('| Delta |');
  });

  it('includes bold total', () => {
    const output = formatSizeReportAsMarkdown(report);
    expect(output).toContain('**Total:**');
  });

  it('includes all package rows', () => {
    const output = formatSizeReportAsMarkdown(report);
    expect(output).toContain('react');
    expect(output).toContain('axios');
  });
});

describe('formatSizeReport', () => {
  it('defaults to text format', () => {
    expect(formatSizeReport(report)).toBe(formatSizeReportAsText(report));
  });

  it('returns markdown when specified', () => {
    expect(formatSizeReport(report, 'markdown')).toBe(formatSizeReportAsMarkdown(report));
  });
});
