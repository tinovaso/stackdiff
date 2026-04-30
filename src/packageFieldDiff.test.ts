import { diffPackageFields, buildPackageFieldReport } from './packageFieldDiff';

const pkgA = {
  name: 'my-app',
  version: '1.0.0',
  description: 'An application',
  license: 'MIT',
  author: 'Alice',
  repository: { type: 'git', url: 'https://github.com/alice/my-app' },
};

const pkgB = {
  name: 'my-app',
  version: '2.0.0',
  description: 'A better application',
  license: 'Apache-2.0',
  homepage: 'https://my-app.dev',
  repository: { type: 'git', url: 'https://github.com/alice/my-app' },
};

describe('diffPackageFields', () => {
  it('detects unchanged fields', () => {
    const report = diffPackageFields(pkgA, pkgB, ['name']);
    expect(report.entries[0].status).toBe('unchanged');
    expect(report.hasChanges).toBe(false);
  });

  it('detects changed fields', () => {
    const report = diffPackageFields(pkgA, pkgB, ['version']);
    expect(report.entries[0].status).toBe('changed');
    expect(report.entries[0].oldValue).toBe('1.0.0');
    expect(report.entries[0].newValue).toBe('2.0.0');
    expect(report.hasChanges).toBe(true);
  });

  it('detects added fields', () => {
    const report = diffPackageFields(pkgA, pkgB, ['homepage']);
    expect(report.entries[0].status).toBe('added');
    expect(report.entries[0].oldValue).toBeUndefined();
    expect(report.entries[0].newValue).toBe('https://my-app.dev');
  });

  it('detects removed fields', () => {
    const report = diffPackageFields(pkgA, pkgB, ['author']);
    expect(report.entries[0].status).toBe('removed');
    expect(report.entries[0].oldValue).toBe('Alice');
    expect(report.entries[0].newValue).toBeUndefined();
  });

  it('normalizes object values to JSON strings', () => {
    const report = diffPackageFields(pkgA, pkgB, ['repository']);
    expect(report.entries[0].status).toBe('unchanged');
  });

  it('reports hasChanges true when any field differs', () => {
    const report = diffPackageFields(pkgA, pkgB, ['name', 'version', 'license']);
    expect(report.hasChanges).toBe(true);
    const changed = report.entries.filter((e) => e.status === 'changed');
    expect(changed.map((e) => e.field)).toEqual(['version', 'license']);
  });
});

describe('buildPackageFieldReport', () => {
  it('uses default tracked fields when none specified', () => {
    const report = buildPackageFieldReport(pkgA as Record<string, unknown>, pkgB as Record<string, unknown>);
    expect(report.entries.length).toBeGreaterThan(0);
    expect(report.hasChanges).toBe(true);
  });

  it('accepts custom field list', () => {
    const report = buildPackageFieldReport(
      pkgA as Record<string, unknown>,
      pkgB as Record<string, unknown>,
      ['name']
    );
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].field).toBe('name');
  });
});
