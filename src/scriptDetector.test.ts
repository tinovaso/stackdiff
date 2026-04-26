import { diffScripts, hasScriptDifferences } from './scriptDetector';
import { PackageJson } from './packageParser';

function makePkg(scripts: Record<string, string>): PackageJson {
  return { name: 'test', version: '1.0.0', scripts } as any;
}

describe('diffScripts', () => {
  it('returns empty report for identical scripts', () => {
    const pkg = makePkg({ build: 'tsc', test: 'jest' });
    const report = diffScripts(pkg, pkg);
    expect(report.addedCount).toBe(0);
    expect(report.removedCount).toBe(0);
    expect(report.changedCount).toBe(0);
    expect(report.unchangedCount).toBe(2);
  });

  it('detects added scripts', () => {
    const pkgA = makePkg({ build: 'tsc' });
    const pkgB = makePkg({ build: 'tsc', lint: 'eslint .' });
    const report = diffScripts(pkgA, pkgB);
    expect(report.addedCount).toBe(1);
    expect(report.entries.find(e => e.name === 'lint')?.onlyIn).toBe('b');
  });

  it('detects removed scripts', () => {
    const pkgA = makePkg({ build: 'tsc', lint: 'eslint .' });
    const pkgB = makePkg({ build: 'tsc' });
    const report = diffScripts(pkgA, pkgB);
    expect(report.removedCount).toBe(1);
    expect(report.entries.find(e => e.name === 'lint')?.onlyIn).toBe('a');
  });

  it('detects changed scripts', () => {
    const pkgA = makePkg({ build: 'tsc' });
    const pkgB = makePkg({ build: 'tsc --project tsconfig.prod.json' });
    const report = diffScripts(pkgA, pkgB);
    expect(report.changedCount).toBe(1);
    const entry = report.entries.find(e => e.name === 'build');
    expect(entry?.changed).toBe(true);
    expect(entry?.command).toBe('tsc --project tsconfig.prod.json');
  });

  it('handles packages with no scripts field', () => {
    const pkgA = { name: 'a', version: '1.0.0' } as PackageJson;
    const pkgB = makePkg({ test: 'jest' });
    const report = diffScripts(pkgA, pkgB);
    expect(report.addedCount).toBe(1);
    expect(report.removedCount).toBe(0);
  });

  it('sorts entries alphabetically', () => {
    const pkgA = makePkg({ z: 'z', a: 'a', m: 'm' });
    const pkgB = makePkg({ z: 'z', a: 'a', m: 'm' });
    const report = diffScripts(pkgA, pkgB);
    const names = report.entries.map(e => e.name);
    expect(names).toEqual(['a', 'm', 'z']);
  });
});

describe('hasScriptDifferences', () => {
  it('returns false when no differences', () => {
    const pkg = makePkg({ build: 'tsc' });
    expect(hasScriptDifferences(diffScripts(pkg, pkg))).toBe(false);
  });

  it('returns true when there are differences', () => {
    const pkgA = makePkg({ build: 'tsc' });
    const pkgB = makePkg({ build: 'tsc', test: 'jest' });
    expect(hasScriptDifferences(diffScripts(pkgA, pkgB))).toBe(true);
  });
});
