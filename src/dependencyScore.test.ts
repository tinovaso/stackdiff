import {
  scoreDependency,
  buildScoreReport,
  scoreGrade,
} from './dependencyScore';
import { DiffEntry } from './diffEngine';

const added: DiffEntry = { name: 'lodash', type: 'added', newVersion: '4.0.0' };
const removed: DiffEntry = { name: 'moment', type: 'removed', oldVersion: '2.0.0' };
const major: DiffEntry = { name: 'react', type: 'changed', oldVersion: '16.0.0', newVersion: '18.0.0' };
const minor: DiffEntry = { name: 'axios', type: 'changed', oldVersion: '1.0.0', newVersion: '1.3.0' };
const patch: DiffEntry = { name: 'chalk', type: 'changed', oldVersion: '5.0.0', newVersion: '5.0.1' };

describe('scoreDependency', () => {
  it('scores added packages', () => {
    const result = scoreDependency(added);
    expect(result.score).toBe(5);
    expect(result.reasons[0]).toMatch(/New dependency/);
  });

  it('scores removed packages', () => {
    const result = scoreDependency(removed);
    expect(result.score).toBe(7);
    expect(result.reasons[0]).toMatch(/removed/);
  });

  it('scores major version change', () => {
    const result = scoreDependency(major);
    expect(result.score).toBe(10);
  });

  it('scores minor version change', () => {
    const result = scoreDependency(minor);
    expect(result.score).toBe(3);
  });

  it('scores patch version change', () => {
    const result = scoreDependency(patch);
    expect(result.score).toBe(1);
  });
});

describe('buildScoreReport', () => {
  it('aggregates scores correctly', () => {
    const report = buildScoreReport([added, removed, major]);
    expect(report.totalScore).toBe(5 + 7 + 10);
    expect(report.entries).toHaveLength(3);
  });

  it('returns grade A for low ratio', () => {
    const report = buildScoreReport([patch]);
    expect(['A', 'B']).toContain(report.grade);
  });
});

describe('scoreGrade', () => {
  it('returns A for 0', () => expect(scoreGrade(0)).toBe('A'));
  it('returns F for 1', () => expect(scoreGrade(1)).toBe('F'));
  it('returns C for 0.4', () => expect(scoreGrade(0.4)).toBe('C'));
});
