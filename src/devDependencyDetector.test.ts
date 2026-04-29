import { diffDevDependencies, buildDevDependencyReport } from './devDependencyDetector';
import { formatDevReportAsText, formatDevReportAsMarkdown } from './devDependencyFormatter';
import { PackageJson } from './packageParser';

function makePkg(devDeps: Record<string, string>): PackageJson {
  return { name: 'test', version: '1.0.0', dependencies: {}, devDependencies: devDeps };
}

describe('diffDevDependencies', () => {
  it('detects added devDependency', () => {
    const a = makePkg({});
    const b = makePkg({ jest: '^29.0.0' });
    const entries = diffDevDependencies(a, b);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ name: 'jest', status: 'added', versionA: null, versionB: '^29.0.0' });
  });

  it('detects removed devDependency', () => {
    const a = makePkg({ mocha: '^10.0.0' });
    const b = makePkg({});
    const entries = diffDevDependencies(a, b);
    expect(entries[0]).toMatchObject({ name: 'mocha', status: 'removed', versionA: '^10.0.0', versionB: null });
  });

  it('detects changed devDependency', () => {
    const a = makePkg({ typescript: '^4.9.0' });
    const b = makePkg({ typescript: '^5.0.0' });
    const entries = diffDevDependencies(a, b);
    expect(entries[0]).toMatchObject({ name: 'typescript', status: 'changed' });
  });

  it('detects unchanged devDependency', () => {
    const a = makePkg({ eslint: '^8.0.0' });
    const b = makePkg({ eslint: '^8.0.0' });
    const entries = diffDevDependencies(a, b);
    expect(entries[0]).toMatchObject({ name: 'eslint', status: 'unchanged' });
  });

  it('handles missing devDependencies field', () => {
    const a: PackageJson = { name: 'x', version: '1.0.0', dependencies: {} };
    const b = makePkg({ vitest: '^1.0.0' });
    const entries = diffDevDependencies(a, b);
    expect(entries).toHaveLength(1);
    expect(entries[0].status).toBe('added');
  });
});

describe('buildDevDependencyReport', () => {
  it('counts totals correctly', () => {
    const a = makePkg({ mocha: '^10.0.0', ts: '^4.0.0' });
    const b = makePkg({ jest: '^29.0.0', ts: '^5.0.0' });
    const entries = diffDevDependencies(a, b);
    const report = buildDevDependencyReport(entries);
    expect(report.totalAdded).toBe(1);
    expect(report.totalRemoved).toBe(1);
    expect(report.totalChanged).toBe(1);
  });
});

describe('formatDevReportAsText', () => {
  it('shows no changes when all unchanged', () => {
    const a = makePkg({ eslint: '^8.0.0' });
    const b = makePkg({ eslint: '^8.0.0' });
    const report = buildDevDependencyReport(diffDevDependencies(a, b));
    expect(formatDevReportAsText(report)).toContain('no changes');
  });

  it('includes added package in text output', () => {
    const a = makePkg({});
    const b = makePkg({ jest: '^29.0.0' });
    const report = buildDevDependencyReport(diffDevDependencies(a, b));
    const out = formatDevReportAsText(report);
    expect(out).toContain('+ jest');
  });
});

describe('formatDevReportAsMarkdown', () => {
  it('includes markdown table header', () => {
    const report = buildDevDependencyReport([]);
    const out = formatDevReportAsMarkdown(report);
    expect(out).toContain('| Package |');
  });
});
