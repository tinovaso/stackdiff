import {
  classifyStrategy,
  analyzeResolutionStrategies,
  ResolutionStrategyReport,
} from './resolutionStrategyAnalyzer';

describe('classifyStrategy', () => {
  it('classifies exact versions', () => {
    expect(classifyStrategy('1.2.3')).toBe('exact');
  });

  it('classifies caret ranges', () => {
    expect(classifyStrategy('^1.2.3')).toBe('caret');
  });

  it('classifies tilde ranges', () => {
    expect(classifyStrategy('~1.2.3')).toBe('tilde');
  });

  it('classifies complex ranges', () => {
    expect(classifyStrategy('>=1.0.0 <2.0.0')).toBe('range');
    expect(classifyStrategy('1.x || 2.x')).toBe('range');
  });

  it('classifies wildcard versions', () => {
    expect(classifyStrategy('*')).toBe('wildcard');
    expect(classifyStrategy('latest')).toBe('wildcard');
    expect(classifyStrategy('')).toBe('wildcard');
  });

  it('classifies unknown versions', () => {
    expect(classifyStrategy('workspace:^')).toBe('unknown');
  });
});

describe('analyzeResolutionStrategies', () => {
  const mapA = { react: '^17.0.0', lodash: '4.17.21', axios: '~0.21.0' };
  const mapB = { react: '^18.0.0', lodash: '4.17.21', chalk: '*' };

  let report: ResolutionStrategyReport;

  beforeEach(() => {
    report = analyzeResolutionStrategies(mapA, mapB);
  });

  it('includes all packages from both maps', () => {
    const names = report.entries.map((e) => e.name);
    expect(names).toContain('react');
    expect(names).toContain('lodash');
    expect(names).toContain('axios');
    expect(names).toContain('chalk');
  });

  it('marks packages in both maps as side both', () => {
    const react = report.entries.find((e) => e.name === 'react');
    expect(react?.side).toBe('both');
  });

  it('marks packages only in A as side a', () => {
    const axios = report.entries.find((e) => e.name === 'axios');
    expect(axios?.side).toBe('a');
  });

  it('marks packages only in B as side b', () => {
    const chalk = report.entries.find((e) => e.name === 'chalk');
    expect(chalk?.side).toBe('b');
    expect(chalk?.strategy).toBe('wildcard');
  });

  it('builds an accurate summary', () => {
    expect(report.summary.caret).toBeGreaterThanOrEqual(1);
    expect(report.summary.exact).toBeGreaterThanOrEqual(1);
    expect(report.summary.wildcard).toBeGreaterThanOrEqual(1);
    expect(report.summary.tilde).toBeGreaterThanOrEqual(1);
  });
});
