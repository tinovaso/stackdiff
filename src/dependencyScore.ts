import { DiffEntry } from './diffEngine';
import { classifyVersionChange } from './semverGroup';

export interface DependencyScore {
  package: string;
  score: number;
  reasons: string[];
}

export interface ScoreReport {
  totalScore: number;
  maxPossibleScore: number;
  grade: string;
  entries: DependencyScore[];
}

const SEVERITY_WEIGHTS: Record<string, number> = {
  major: 10,
  minor: 3,
  patch: 1,
  added: 5,
  removed: 7,
  unchanged: 0,
};

export function scoreDependency(entry: DiffEntry): DependencyScore {
  const reasons: string[] = [];
  let score = 0;

  if (entry.type === 'added') {
    score += SEVERITY_WEIGHTS.added;
    reasons.push('New dependency introduced');
  } else if (entry.type === 'removed') {
    score += SEVERITY_WEIGHTS.removed;
    reasons.push('Dependency removed');
  } else if (entry.type === 'changed' && entry.oldVersion && entry.newVersion) {
    const change = classifyVersionChange(entry.oldVersion, entry.newVersion);
    score += SEVERITY_WEIGHTS[change] ?? 0;
    reasons.push(`Version change: ${change} (${entry.oldVersion} → ${entry.newVersion})`);
  }

  return { package: entry.name, score, reasons };
}

export function scoreGrade(ratio: number): string {
  if (ratio <= 0.1) return 'A';
  if (ratio <= 0.25) return 'B';
  if (ratio <= 0.5) return 'C';
  if (ratio <= 0.75) return 'D';
  return 'F';
}

export function buildScoreReport(diff: DiffEntry[]): ScoreReport {
  const entries = diff.map(scoreDependency);
  const totalScore = entries.reduce((sum, e) => sum + e.score, 0);
  const maxPossibleScore = diff.length * SEVERITY_WEIGHTS.removed;
  const ratio = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
  const grade = scoreGrade(ratio);
  return { totalScore, maxPossibleScore, grade, entries };
}
