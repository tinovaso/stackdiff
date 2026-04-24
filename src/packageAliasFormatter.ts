import { AliasReport, AliasEntry } from './packageAliasDetector';

function formatEntryAsText(entry: AliasEntry): string {
  return `  ${entry.alias} → ${entry.resolvedPackage}@${entry.version}`;
}

function formatEntryAsMarkdown(entry: AliasEntry): string {
  return `| \`${entry.alias}\` | \`${entry.resolvedPackage}\` | \`${entry.version}\` |`;
}

export function formatAliasReportAsText(report: AliasReport): string {
  if (report.totalCount === 0) {
    return 'No package aliases detected.';
  }
  const lines = [`Package Aliases (${report.totalCount} found):`, ''];
  for (const entry of report.aliases) {
    lines.push(formatEntryAsText(entry));
  }
  return lines.join('\n');
}

export function formatAliasReportAsMarkdown(report: AliasReport): string {
  if (report.totalCount === 0) {
    return '_No package aliases detected._';
  }
  const lines = [
    `## Package Aliases (${report.totalCount} found)`,
    '',
    '| Alias | Resolved Package | Version |',
    '|-------|-----------------|---------|',
  ];
  for (const entry of report.aliases) {
    lines.push(formatEntryAsMarkdown(entry));
  }
  return lines.join('\n');
}

export function formatAliasReport(
  report: AliasReport,
  format: 'text' | 'markdown' = 'text'
): string {
  if (format === 'markdown') return formatAliasReportAsMarkdown(report);
  return formatAliasReportAsText(report);
}
