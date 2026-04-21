import { findTransitiveDependencies, buildTransitiveReport } from './transitiveDetector';

const root = {
  react: '18.0.0',
  lodash: '4.17.21',
};

const allPackages: Record<string, Record<string, string>> = {
  react: {
    'loose-envify': '1.4.0',
    'object-assign': '4.1.1',
  },
  lodash: {},
  'loose-envify': {
    js_tokens: '4.0.0',
  },
  'object-assign': {},
  js_tokens: {},
};

describe('findTransitiveDependencies', () => {
  it('identifies direct and transitive dependencies', () => {
    const report = findTransitiveDependencies(root, allPackages);
    expect(report.direct).toContain('react');
    expect(report.direct).toContain('lodash');
    expect(report.transitive.map(d => d.name)).toContain('loose-envify');
    expect(report.transitive.map(d => d.name)).toContain('object-assign');
    expect(report.transitive.map(d => d.name)).toContain('js_tokens');
  });

  it('does not include direct deps in transitive list', () => {
    const report = findTransitiveDependencies(root, allPackages);
    const names = report.transitive.map(d => d.name);
    expect(names).not.toContain('react');
    expect(names).not.toContain('lodash');
  });

  it('records correct introducedBy chain', () => {
    const report = findTransitiveDependencies(root, allPackages);
    const looseEnvify = report.transitive.find(d => d.name === 'loose-envify');
    expect(looseEnvify?.introducedBy).toContain('react');
  });

  it('records correct depth', () => {
    const report = findTransitiveDependencies(root, allPackages);
    const jsTokens = report.transitive.find(d => d.name === 'js_tokens');
    expect(jsTokens?.depth).toBe(3);
  });

  it('returns zero transitive when no nested deps exist', () => {
    const report = findTransitiveDependencies({ lodash: '4.17.21' }, allPackages);
    expect(report.totalTransitive).toBe(0);
  });
});

describe('buildTransitiveReport', () => {
  it('includes summary counts', () => {
    const report = findTransitiveDependencies(root, allPackages);
    const text = buildTransitiveReport(report);
    expect(text).toContain('Direct dependencies: 2');
    expect(text).toContain('Transitive dependencies: 3');
  });

  it('lists transitive entries with version and depth', () => {
    const report = findTransitiveDependencies(root, allPackages);
    const text = buildTransitiveReport(report);
    expect(text).toContain('loose-envify@1.4.0');
    expect(text).toContain('depth 2');
  });
});
