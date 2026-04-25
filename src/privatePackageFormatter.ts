import { PrivatePackageReport, PrivatePackageEntry } from './privatePackageDetector';

function sideLabel(side: PrivatePackageEntry['side']): string {
  switch (side) {
    case 'added': return '[added]';
    case 'removed': return '[removed]';
    default: return '[both]';
  }
}

function formatEntryAsText(entry: PrivatePackageEntry): string {
  return `  ${entry.name}@${entry.version} ${sideLabel(entry.side)}`;
}

export function formatPrivateReportAsText(report: PrivatePackageReport): string {
  if (report.total === 0) {
    return 'No private/local packages detected.';
  }
  const lines = [`Private/local packages (${report.total}):`, ''];
  for (const entry of report.entries) {
    lines.push(formatEntryAsText(entry));
  }
  return lines.join('\n');
}

function formatEntryAsMarkdown(entry: PrivatePackageEntry): string {
  return `| \`${entry.name}\` | \`${entry.version}\` | ${sideLabel(entry.side)} |`;
}

export function formatPrivateReportAsMarkdown(report: PrivatePackageReport): string {
  if (report.total === 0) {
    return '_No private/local packages detected._';
  }
  const lines = [
    `## Private/local packages (${report.total})`,
    '',
    '| Package | Version | Side |',
    '|---------|---------|------|',
  ];
  for (const entry of report.entries) {
    lines.push(formatEntryAsMarkdown(entry));
  }
  return lines.join('\n');
}

export function formatPrivateReport(
  report: PrivatePackageReport,
  format: 'text' | 'markdown' = 'text'
): string {
  return format === 'markdown'
    ? formatPrivateReportAsMarkdown(report)
    : formatPrivateReportAsText(report);
}
