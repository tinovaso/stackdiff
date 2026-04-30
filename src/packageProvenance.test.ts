import { classifyProvenance, detectProvenance, ProvenanceReport } from './packageProvenance';
import { PackageJson } from './packageParser';

function makePkg(deps: Record<string, string> = {}, dev: Record<string, string> = {}): PackageJson {
  return { name: 'test', version: '1.0.0', dependencies: deps, devDependencies: dev };
}

describe('classifyProvenance', () => {
  it('classifies semver as npm', () => {
    expect(classifyProvenance('1.2.3')).toBe('npm');
    expect(classifyProvenance('^2.0.0')).toBe('npm');
    expect(classifyProvenance('~1.0.0')).toBe('npm');
  });

  it('classifies github: prefix as github', () => {
    expect(classifyProvenance('github:owner/repo')).toBe('github');
  });

  it('classifies owner/repo shorthand as github', () => {
    expect(classifyProvenance('owner/repo#main')).toBe('github');
  });

  it('classifies file: prefix as local', () => {
    expect(classifyProvenance('file:../local-pkg')).toBe('local');
  });

  it('classifies relative path as local', () => {
    expect(classifyProvenance('./packages/utils')).toBe('local');
  });

  it('classifies git+ prefix as git', () => {
    expect(classifyProvenance('git+https://github.com/org/repo.git')).toBe('git');
  });

  it('returns unknown for unrecognized strings', () => {
    expect(classifyProvenance('workspace:*')).toBe('unknown');
  });
});

describe('detectProvenance', () => {
  it('returns empty entries when all deps are npm', () => {
    const a = makePkg({ lodash: '^4.0.0' });
    const b = makePkg({ lodash: '^4.17.0' });
    const report = detectProvenance(a, b);
    expect(report.entries).toHaveLength(0);
  });

  it('detects github source in pkg B', () => {
    const a = makePkg({});
    const b = makePkg({ mylib: 'github:org/mylib' });
    const report = detectProvenance(a, b);
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].source).toBe('github');
    expect(report.entries[0].side).toBe('b');
  });

  it('detects local source in pkg A', () => {
    const a = makePkg({ utils: 'file:../utils' });
    const b = makePkg({});
    const report = detectProvenance(a, b);
    expect(report.entries[0].source).toBe('local');
    expect(report.entries[0].side).toBe('a');
  });

  it('marks entry as both when present in both packages', () => {
    const a = makePkg({ mylib: 'github:org/mylib' });
    const b = makePkg({ mylib: 'github:org/mylib' });
    const report = detectProvenance(a, b);
    expect(report.entries[0].side).toBe('both');
  });

  it('populates summary counts correctly', () => {
    const a = makePkg({ a: 'file:../a', b: 'git+https://x.git' });
    const b = makePkg({ c: 'github:org/c' });
    const report = detectProvenance(a, b);
    expect(report.summary.local).toBe(1);
    expect(report.summary.git).toBe(1);
    expect(report.summary.github).toBe(1);
    expect(report.summary.npm).toBe(0);
  });
});
