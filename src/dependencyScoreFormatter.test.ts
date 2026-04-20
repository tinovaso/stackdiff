import { formatScoreReport } from './dependencyScoreFormatter';
import { ScoreReport } from './dependencyScore';
import { DependencyScoreOptions } from './dependencyScoreOptions';

const baseReport: ScoreReport = {
  totalScore: 15,
  maxPossibleScore: 21,
  grade: 'B',
  entries: [
    { package: 'react', score: 10, reasons: ['Version change: major (16.0.0 → 18.0.0)'] },
    { package: 'chalk', score: 1, reasons: ['Version change: patch (5.0.0 → 5.0.1)'] },
    { package: 'unchanged-pkg', score: 0, reasons: [] },
  ],
};

const defaultOptions: DependencyScoreOptions = {
  showAll: false,
  minScore: 0,
  gradeOnly: false,
};

describe('formatScoreReport', () => {
  it('renders grade and total score', () => {
    const output = formatScoreReport(baseReport, defaultOptions);
    expect(output).toContain('15 / 21');
    expect(output).toContain('Grade: B');
  });

  it('hides zero-score entries by default', () => {
    const output = formatScoreReport(baseReport, defaultOptions);
    expect(output).not.toContain('unchanged-pkg');
  });

  it('shows zero-score entries when showAll is true', () => {
    const output = formatScoreReport(baseReport, { ...defaultOptions, showAll: true });
    expect(output).toContain('unchanged-pkg');
  });

  it('filters by minScore', () => {
    const output = formatScoreReport(baseReport, { ...defaultOptions, minScore: 5 });
    expect(output).toContain('react');
    expect(output).not.toContain('chalk');
  });

  it('returns only grade line when gradeOnly is true', () => {
    const output = formatScoreReport(baseReport, { ...defaultOptions, gradeOnly: true });
    expect(output).toBe('Grade: B');
  });

  it('shows no packages message when filter removes all', () => {
    const output = formatScoreReport(baseReport, { ...defaultOptions, minScore: 100 });
    expect(output).toContain('No packages match');
  });
});
