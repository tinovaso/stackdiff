import { detectTagChanges, extractTags } from './packageTagDetector';
import { PackageJson } from './packageParser';

function makePkg(deps: Record<string, string>, devDeps?: Record<string, string>): PackageJson {
  return {
    name: 'test',
    version: '1.0.0',
    dependencies: deps,
    devDependencies: devDeps ?? {},
  } as PackageJson;
}

describe('extractTags', () => {
  it('returns empty array when no keywords field', () => {
    const pkg = makePkg({});
    expect(extractTags(pkg, 'test')).toEqual([]);
  });

  it('returns keywords when present', () => {
    const pkg = { ...makePkg({}), keywords: ['cli', 'tool'] } as any;
    expect(extractTags(pkg, 'test')).toEqual(['cli', 'tool']);
  });
});

describe('detectTagChanges', () => {
  it('returns empty report when deps are identical', () => {
    const pkg = makePkg({ react: '18.0.0' });
    const report = detectTagChanges(pkg, pkg);
    expect(report.entries).toHaveLength(0);
    expect(report.totalAdded).toBe(0);
    expect(report.totalRemoved).toBe(0);
  });

  it('detects added dependency version tag', () => {
    const pkgA = makePkg({ react: '17.0.0' });
    const pkgB = makePkg({ react: '18.0.0' });
    const report = detectTagChanges(pkgA, pkgB);
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].name).toBe('react');
    expect(report.entries[0].added).toContain('18.0.0');
    expect(report.entries[0].removed).toContain('17.0.0');
    expect(report.totalAdded).toBe(1);
    expect(report.totalRemoved).toBe(1);
  });

  it('detects newly added package', () => {
    const pkgA = makePkg({});
    const pkgB = makePkg({ lodash: '4.17.21' });
    const report = detectTagChanges(pkgA, pkgB);
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].side).toBe('b');
    expect(report.entries[0].added).toContain('4.17.21');
  });

  it('detects removed package', () => {
    const pkgA = makePkg({ lodash: '4.17.21' });
    const pkgB = makePkg({});
    const report = detectTagChanges(pkgA, pkgB);
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].side).toBe('a');
    expect(report.entries[0].removed).toContain('4.17.21');
  });

  it('includes devDependencies in comparison', () => {
    const pkgA = makePkg({}, { jest: '28.0.0' });
    const pkgB = makePkg({}, { jest: '29.0.0' });
    const report = detectTagChanges(pkgA, pkgB);
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].name).toBe('jest');
  });
});
