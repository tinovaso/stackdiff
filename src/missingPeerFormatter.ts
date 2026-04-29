import { MissingPeerReport, MissingPeerEntry } from './missingPeerDetector';

function formatEntryAsText(entry: MissingPeerEntry): string {
  const installed = entry.installedVersion ?? 'not installed';
  return `  ✗ ${entry.package}@${entry.requiredRange} (required by ${entry.requiredBy}) — ${installed}`;
}

function formatEntryAsMarkdown(entry: MissingPeerEntry): string {
  const installed = entry.installedVersion ?? '_not installed_';
  return `| ${entry.package} | \`${entry.requiredRange}\` | ${entry.requiredBy} | ${installed} |`;
}

export function formatMissingPeerReportAsText(report: MissingPeerReport): string {
  if (report.total === 0) {
    return 'No missing peer dependencies detected.';
  }
  const lines = [`Missing Peer Dependencies (${report.total}):`, ''];
  for (const entry of report.missing) {
    lines.push(formatEntryAsText(entry));
  }
  return lines.join('\n');
}

export function formatMissingPeerReportAsMarkdown(report: MissingPeerReport): string {
  if (report.total === 0) {
    return '_No missing peer dependencies detected._';
  }
  const lines = [
    `## Missing Peer Dependencies (${report.total})`,
    '',
    '| Package | Required Range | Required By | Installed |',
    '|---------|---------------|-------------|-----------|',
  ];
  for (const entry of report.missing) {
    lines.push(formatEntryAsMarkdown(entry));
  }
  return lines.join('\n');
}

export function formatMissingPeerReport(
  report: MissingPeerReport,
  format: 'text' | 'markdown' = 'text'
): string {
  return format === 'markdown'
    ? formatMissingPeerReportAsMarkdown(report)
    : formatMissingPeerReportAsText(report);
}
