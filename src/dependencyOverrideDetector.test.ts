import { detectOverrides, OverrideReport } from './dependencyOverrideDetector';
import { PackageJson } from './packageParser';

function makePkg(overrides?: Record<string, string>): PackageJson {
  return {
    name: 'test',
    version: '1.0.0',
    dependencies: {},
    devDependencies: {},
    ...(overrides ? { overrides } : {}),
  } as PackageJson;
}

describe('detectOverrides', () => {
  it('returns empty report when neither package has overrides', () => {
    const report = detectOverrides(makePkg(), makePkg());
    expect(report.entries).toHaveLength(0);
    expect(report.totalA).toBe(0);
    expect(report.totalB).toBe(0);
  });

  it('detects overrides only in A', () => {
    const report = detectOverrides(makePkg({ lodash: '4.17.21' }), makePkg());
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].side).toBe('A');
    expect(report.entries[0].name).toBe('lodash');
    expect(report.entries[0].overrideA).toBe('4.17.21');
    expect(report.totalA).toBe(1);
    expect(report.totalB).toBe(0);
  });

  it('detects overrides only in B', () => {
    const report = detectOverrides(makePkg(), makePkg({ react: '18.0.0' }));
    expect(report.entries[0].side).toBe('B');
    expect(report.entries[0].overrideB).toBe('18.0.0');
  });

  it('detects overrides present in both with same version', () => {
    const report = detectOverrides(makePkg({ lodash: '4.0.0' }), makePkg({ lodash: '4.0.0' }));
    expect(report.entries[0].side).toBe('both');
    expect(report.entries[0].overrideA).toBe('4.0.0');
    expect(report.entries[0].overrideB).toBe('4.0.0');
  });

  it('detects overrides present in both with different versions', () => {
    const report = detectOverrides(makePkg({ lodash: '3.0.0' }), makePkg({ lodash: '4.0.0' }));
    expect(report.entries[0].side).toBe('both');
    expect(report.entries[0].overrideA).toBe('3.0.0');
    expect(report.entries[0].overrideB).toBe('4.0.0');
  });

  it('sorts entries alphabetically', () => {
    const report = detectOverrides(
      makePkg({ zebra: '1.0.0', apple: '2.0.0' }),
      makePkg({ mango: '3.0.0' })
    );
    const names = report.entries.map(e => e.name);
    expect(names).toEqual([...names].sort());
  });
});
