import { extractOptionalDeps, detectOptionalDependencies } from './optionalDependencyDetector';
import { PackageJson } from './packageParser';

function makePkg(optional?: Record<string, string>, deps?: Record<string, string>): PackageJson {
  return {
    name: 'test',
    version: '1.0.0',
    dependencies: deps ?? {},
    optionalDependencies: optional ?? {},
  };
}

describe('extractOptionalDeps', () => {
  it('returns empty map when no optional deps', () => {
    const result = extractOptionalDeps(makePkg());
    expect(result.size).toBe(0);
  });

  it('extracts optional dependencies', () => {
    const result = extractOptionalDeps(makePkg({ fsevents: '2.3.2', bufferutil: '^4.0.0' }));
    expect(result.get('fsevents')).toBe('2.3.2');
    expect(result.get('bufferutil')).toBe('^4.0.0');
  });
});

describe('detectOptionalDependencies', () => {
  it('returns empty report when both packages have no optional deps', () => {
    const report = detectOptionalDependencies(makePkg(), makePkg());
    expect(report.entries).toHaveLength(0);
  });

  it('detects added optional dependency', () => {
    const pkgA = makePkg({});
    const pkgB = makePkg({ fsevents: '2.3.2' });
    const report = detectOptionalDependencies(pkgA, pkgB);
    const entry = report.entries.find(e => e.name === 'fsevents');
    expect(entry).toBeDefined();
    expect(entry?.status).toBe('added');
    expect(entry?.side).toBe('b');
  });

  it('detects removed optional dependency', () => {
    const pkgA = makePkg({ bufferutil: '4.0.7' });
    const pkgB = makePkg({});
    const report = detectOptionalDependencies(pkgA, pkgB);
    const entry = report.entries.find(e => e.name === 'bufferutil');
    expect(entry).toBeDefined();
    expect(entry?.status).toBe('removed');
    expect(entry?.side).toBe('a');
  });

  it('detects changed optional dependency version', () => {
    const pkgA = makePkg({ 'utf-8-validate': '5.0.9' });
    const pkgB = makePkg({ 'utf-8-validate': '6.0.0' });
    const report = detectOptionalDependencies(pkgA, pkgB);
    const entry = report.entries.find(e => e.name === 'utf-8-validate');
    expect(entry).toBeDefined();
    expect(entry?.status).toBe('changed');
    expect(entry?.versionA).toBe('5.0.9');
    expect(entry?.versionB).toBe('6.0.0');
  });

  it('ignores unchanged optional dependencies', () => {
    const pkgA = makePkg({ fsevents: '2.3.2' });
    const pkgB = makePkg({ fsevents: '2.3.2' });
    const report = detectOptionalDependencies(pkgA, pkgB);
    expect(report.entries).toHaveLength(0);
  });
});
