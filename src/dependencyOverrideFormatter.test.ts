import { detectOverrides } from './dependencyOverrideDetector';
import { formatOverrideReport, formatOverrideReportAsText, formatOverrideReportAsMarkdown } from './dependencyOverrideFormatter';
import { PackageJson } from './packageParser';

function makePkg(overrides?: Record<string, string>): PackageJson {
  return { name: 'test', version: '1.0.0', dependencies: {}, devDependencies: {}, ...(overrides ? { overrides } : {}) } as PackageJson;
}

describe('formatOverrideReportAsText', () => {
  it('returns no-overrides message for empty report', () => {
    const report = detectOverrides(makePkg(), makePkg());
    expect(formatOverrideReportAsText(report)).toBe('No overrides detected.');
  });

  it('includes package counts', () => {
    const report = detectOverrides(makePkg({ lodash: '4.0.0' }), makePkg());
    const text = formatOverrideReportAsText(report);
    expect(text).toContain('Package A: 1 override(s)');
    expect(text).toContain('Package B: 0 override(s)');
  });

  it('shows A only label', () => {
    const report = detectOverrides(makePkg({ lodash: '4.0.0' }), makePkg());
    expect(formatOverrideReportAsText(report)).toContain('[A only]');
  });

  it('shows B only label', () => {
    const report = detectOverrides(makePkg(), makePkg({ react: '18.0.0' }));
    expect(formatOverrideReportAsText(report)).toContain('[B only]');
  });

  it('shows version diff for both with different versions', () => {
    const report = detectOverrides(makePkg({ lodash: '3.0.0' }), makePkg({ lodash: '4.0.0' }));
    expect(formatOverrideReportAsText(report)).toContain('3.0.0 → 4.0.0');
  });
});

describe('formatOverrideReportAsMarkdown', () => {
  it('returns italic message for empty report', () => {
    const report = detectOverrides(makePkg(), makePkg());
    expect(formatOverrideReportAsMarkdown(report)).toBe('_No overrides detected._');
  });

  it('includes markdown table header', () => {
    const report = detectOverrides(makePkg({ lodash: '4.0.0' }), makePkg());
    expect(formatOverrideReportAsMarkdown(report)).toContain('| Package |');
  });

  it('includes package name in table row', () => {
    const report = detectOverrides(makePkg({ lodash: '4.0.0' }), makePkg());
    expect(formatOverrideReportAsMarkdown(report)).toContain('lodash');
  });
});

describe('formatOverrideReport', () => {
  it('defaults to text format', () => {
    const report = detectOverrides(makePkg(), makePkg());
    expect(formatOverrideReport(report)).toBe('No overrides detected.');
  });

  it('uses markdown format when specified', () => {
    const report = detectOverrides(makePkg(), makePkg());
    expect(formatOverrideReport(report, 'markdown')).toBe('_No overrides detected._');
  });
});
