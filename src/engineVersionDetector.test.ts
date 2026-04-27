import {
  extractEngines,
  diffEngineVersions,
  buildEngineVersionReport,
} from './engineVersionDetector';
import { PackageJson } from './packageParser';

function makePkg(engines?: Record<string, string>): PackageJson {
  return { name: 'test', version: '1.0.0', dependencies: {}, engines } as any;
}

describe('extractEngines', () => {
  it('returns empty object when no engines field', () => {
    expect(extractEngines(makePkg())).toEqual({});
  });

  it('returns engines when present', () => {
    expect(extractEngines(makePkg({ node: '>=16' }))).toEqual({ node: '>=16' });
  });
});

describe('diffEngineVersions', () => {
  it('reports no differences when engines are identical', () => {
    const pkgA = makePkg({ node: '>=16' });
    const pkgB = makePkg({ node: '>=16' });
    const result = diffEngineVersions(pkgA, pkgB);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it('detects added engine in pkgB', () => {
    const pkgA = makePkg({});
    const pkgB = makePkg({ node: '>=18' });
    const result = diffEngineVersions(pkgA, pkgB);
    expect(result.added).toHaveLength(1);
    expect(result.added[0]).toMatchObject({ name: 'node', required: '>=18', side: 'b' });
  });

  it('detects removed engine from pkgA', () => {
    const pkgA = makePkg({ npm: '>=8' });
    const pkgB = makePkg({});
    const result = diffEngineVersions(pkgA, pkgB);
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0]).toMatchObject({ name: 'npm', required: '>=8', side: 'a' });
  });

  it('detects changed engine version', () => {
    const pkgA = makePkg({ node: '>=14' });
    const pkgB = makePkg({ node: '>=18' });
    const result = diffEngineVersions(pkgA, pkgB);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0]).toMatchObject({ name: 'node', versionA: '>=14', versionB: '>=18' });
  });

  it('handles multiple engines with mixed changes', () => {
    const pkgA = makePkg({ node: '>=14', npm: '>=7' });
    const pkgB = makePkg({ node: '>=18', yarn: '>=1' });
    const result = diffEngineVersions(pkgA, pkgB);
    expect(result.changed.map(d => d.name)).toContain('node');
    expect(result.removed.map(r => r.name)).toContain('npm');
    expect(result.added.map(a => a.name)).toContain('yarn');
  });
});

describe('buildEngineVersionReport', () => {
  it('returns no differences message when nothing changed', () => {
    const pkgA = makePkg({ node: '>=16' });
    const pkgB = makePkg({ node: '>=16' });
    const report = diffEngineVersions(pkgA, pkgB);
    const output = buildEngineVersionReport(report);
    expect(output).toContain('No engine version differences found.');
  });

  it('formats added, removed, and changed entries', () => {
    const pkgA = makePkg({ node: '>=14', npm: '>=7' });
    const pkgB = makePkg({ node: '>=18', yarn: '>=1' });
    const report = diffEngineVersions(pkgA, pkgB);
    const output = buildEngineVersionReport(report);
    expect(output).toContain('+ yarn');
    expect(output).toContain('- npm');
    expect(output).toContain('~ node');
  });
});
