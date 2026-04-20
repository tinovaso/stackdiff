import { ScoreReport, DependencyScore } from './dependencyScore';
import { DependencyScoreOptions } from './dependencyScoreOptions';

function formatEntry(entry: DependencyScore): string {
  const reasons = entry.reasons.join('; ');
  return `  [${entry.score.toString().padStart(3)}] ${entry.package} — ${reasons}`;
}

export function formatScoreReport(
  report: ScoreReport,
  options: DependencyScoreOptions
): string {
  const lines: string[] = [];

  if (options.gradeOnly) {
    return `Grade: ${report.grade}`;
  }

  lines.push(`Dependency Change Score: ${report.totalScore} / ${report.maxPossibleScore}`);
  lines.push(`Overall Grade: ${report.grade}`);
  lines.push('');

  const filtered = options.showAll
    ? report.entries
    : report.entries.filter((e) => e.score > 0);

  const visible = filtered.filter((e) => e.score >= options.minScore);

  if (visible.length === 0) {
    lines.push('  No packages match the current filter.');
  } else {
    visible.forEach((entry) => lines.push(formatEntry(entry)));
  }

  return lines.join('\n');
}
