import { buildTreeShakeReport } from './treeShakeAnalyzer';
import {
  formatResultAsText,
  formatTreeShakeReportAsText,
  formatTreeShakeReportAsMarkdown,
  formatTreeShakeReport,
} from './treeShakeFormatter';

const deps = { 'lodash-es': '4.17.21', express: '4.18.0' };
const sizeMap = { 'lodash-es': 100, express: 80 };
const report = buildTreeShakeReport(deps, sizeMap);

describe('formatResultAsText', () => {
  it('includes package name and version', () => {
    const line = formatResultAsText(report.results[0]);
    expect(line).toContain('lodash-es@4.17.21');
  });

  it('indicates ESM compatibility', () => {
    const esm = report.results.find((r) => r.esModuleCompatible);
    expect(formatResultAsText(esm!)).toContain('✓ ESM');
  });

  it('indicates CJS for non-ESM packages', () => {
    const cjs = report.results.find((r) => !r.esModuleCompatible);
    if (cjs) expect(formatResultAsText(cjs)).toContain('✗ CJS');
  });
});

describe('formatTreeShakeReportAsText', () => {
  it('includes header', () => {
    const text = formatTreeShakeReportAsText(report);
    expect(text).toContain('Tree-Shake Analysis');
  });

  it('includes total savings line', () => {
    const text = formatTreeShakeReportAsText(report);
    expect(text).toContain('Estimated savings');
  });

  it('includes all packages', () => {
    const text = formatTreeShakeReportAsText(report);
    expect(text).toContain('lodash-es');
    expect(text).toContain('express');
  });
});

describe('formatTreeShakeReportAsMarkdown', () => {
  it('produces markdown table', () => {
    const md = formatTreeShakeReportAsMarkdown(report);
    expect(md).toContain('| Package |');
    expect(md).toContain('|---------|');
  });

  it('includes bold totals', () => {
    const md = formatTreeShakeReportAsMarkdown(report);
    expect(md).toContain('**Total original:**');
  });
});

describe('formatTreeShakeReport', () => {
  it('defaults to text format', () => {
    const out = formatTreeShakeReport(report);
    expect(out).toContain('Tree-Shake Analysis');
  });

  it('uses markdown when specified', () => {
    const out = formatTreeShakeReport(report, 'markdown');
    expect(out).toContain('## Tree-Shake Analysis');
  });
});
