import { PublishDateEntry, PublishDateReport } from './packagePublishDateDetector';

function deltaLabel(days: number | null): string {
  if (days === null) return 'N/A';
  if (days === 0) return 'same day';
  if (days > 0) return `+${days}d newer`;
  return `${days}d older`;
}

function formatEntryAsText(entry: PublishDateEntry): string {
  const a = entry.publishedAtA ?? 'unknown';
  const b = entry.publishedAtB ?? 'unknown';
  const delta = deltaLabel(entry.daysDelta);
  return `  ${entry.name}: A=${a}  B=${b}  (${delta})`;
}

function formatEntryAsMarkdown(entry: PublishDateEntry): string {
  const a = entry.publishedAtA ?? 'unknown';
  const b = entry.publishedAtB ?? 'unknown';
  const delta = deltaLabel(entry.daysDelta);
  return `| ${entry.name} | ${a} | ${b} | ${delta} |`;
}

export function formatPublishDateReportAsText(report: PublishDateReport): string {
  if (report.entries.length === 0) return 'No publish date data available.\n';
  const lines = ['Publish Date Comparison:', ...report.entries.map(formatEntryAsText)];
  return lines.join('\n') + '\n';
}

export function formatPublishDateReportAsMarkdown(report: PublishDateReport): string {
  if (report.entries.length === 0) return '_No publish date data available._\n';
  const header = '| Package | Published (A) | Published (B) | Delta |';
  const separator = '|---------|--------------|--------------|-------|';
  const rows = report.entries.map(formatEntryAsMarkdown);
  return [header, separator, ...rows].join('\n') + '\n';
}

export function formatPublishDateReport(
  report: PublishDateReport,
  format: 'text' | 'markdown' = 'text'
): string {
  if (format === 'markdown') return formatPublishDateReportAsMarkdown(report);
  return formatPublishDateReportAsText(report);
}
