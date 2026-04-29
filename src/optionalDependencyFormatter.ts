import { OptionalDependencyReport, OptionalDependencyEntry } from './optionalDependencyDetector';

function formatEntryAsText(entry: OptionalDependencyEntry): string {
  const side = entry.side === 'a' ? '[A]' : '[B]';
  const versionA = entry.versionA ?? '—';
  const versionB = entry.versionB ?? '—';
  if (entry.status === 'added') {
    return `  + ${entry.name}@${entry.versionB} ${side} (optional)`;
  }
  if (entry.status === 'removed') {
    return `  - ${entry.name}@${entry.versionA} ${side} (optional)`;
  }
  return `  ~ ${entry.name}: ${versionA} → ${versionB} ${side} (optional)`;
}

function formatEntryAsMarkdown(entry: OptionalDependencyEntry): string {
  const side = entry.side === 'a' ? '**[A]**' : '**[B]**';
  const versionA = entry.versionA ?? '—';
  const versionB = entry.versionB ?? '—';
  if (entry.status === 'added') {
    return `| \`${entry.name}\` | — | \`${entry.versionB}\` | added | ${side} |`;
  }
  if (entry.status === 'removed') {
    return `| \`${entry.name}\` | \`${entry.versionA}\` | — | removed | ${side} |`;
  }
  return `| \`${entry.name}\` | \`${versionA}\` | \`${versionB}\` | changed | ${side} |`;
}

export function formatOptionalReportAsText(report: OptionalDependencyReport): string {
  if (report.entries.length === 0) {
    return 'No optional dependency differences found.';
  }
  const lines = ['Optional Dependency Differences:', ...report.entries.map(formatEntryAsText)];
  return lines.join('\n');
}

export function formatOptionalReportAsMarkdown(report: OptionalDependencyReport): string {
  if (report.entries.length === 0) {
    return '_No optional dependency differences found._';
  }
  const header = '## Optional Dependency Differences\n\n| Package | Version A | Version B | Status | Side |\n|---------|-----------|-----------|--------|------|';
  const rows = report.entries.map(formatEntryAsMarkdown);
  return [header, ...rows].join('\n');
}

export function formatOptionalReport(report: OptionalDependencyReport, format: 'text' | 'markdown'): string {
  return format === 'markdown'
    ? formatOptionalReportAsMarkdown(report)
    : formatOptionalReportAsText(report);
}
