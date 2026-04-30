import { FreshnessReport, FreshnessEntry } from './dependencyFreshnessDetector';

const STATUS_SYMBOLS: Record<string, string> = {
  fresh: '✔',
  stale: '⚠',
  outdated: '✖',
};

function formatEntryAsText(entry: FreshnessEntry): string {
  const sym = STATUS_SYMBOLS[entry.status];
  const behind = entry.daysBehind > 0 ? ` (${entry.daysBehind}d behind)` : '';
  return `  ${sym} ${entry.name}@${entry.version} → ${entry.latestVersion}${behind} [score: ${entry.freshnessScore}]`;
}

function formatEntryAsMarkdown(entry: FreshnessEntry): string {
  const sym = STATUS_SYMBOLS[entry.status];
  const behind = entry.daysBehind > 0 ? ` *(${entry.daysBehind}d behind)*` : '';
  return `| ${sym} | \`${entry.name}\` | ${entry.version} | ${entry.latestVersion} | ${entry.freshnessScore} |${behind}`;
}

export function formatFreshnessReportAsText(report: FreshnessReport): string {
  if (report.entries.length === 0) return 'No freshness data available.\n';

  const lines: string[] = [
    `Dependency Freshness Report`,
    `Average Score: ${report.averageScore}/100  Fresh: ${report.freshCount}  Stale: ${report.staleCount}  Outdated: ${report.outdatedCount}`,
    '',
  ];

  for (const entry of report.entries) {
    lines.push(formatEntryAsText(entry));
  }

  return lines.join('\n') + '\n';
}

export function formatFreshnessReportAsMarkdown(report: FreshnessReport): string {
  if (report.entries.length === 0) return '_No freshness data available._\n';

  const lines: string[] = [
    `## Dependency Freshness Report`,
    `**Average Score:** ${report.averageScore}/100 | **Fresh:** ${report.freshCount} | **Stale:** ${report.staleCount} | **Outdated:** ${report.outdatedCount}`,
    '',
    '| Status | Package | Current | Latest | Score |',
    '|--------|---------|---------|--------|-------|',
  ];

  for (const entry of report.entries) {
    lines.push(formatEntryAsMarkdown(entry));
  }

  return lines.join('\n') + '\n';
}

export function formatFreshnessReport(report: FreshnessReport, format: 'text' | 'markdown'): string {
  return format === 'markdown'
    ? formatFreshnessReportAsMarkdown(report)
    : formatFreshnessReportAsText(report);
}
