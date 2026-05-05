import { TagReport, TagEntry } from './packageTagDetector';

function formatEntryAsText(entry: TagEntry): string {
  const lines: string[] = [`  ${entry.name}:`];
  for (const t of entry.added) lines.push(`    + ${t}`);
  for (const t of entry.removed) lines.push(`    - ${t}`);
  return lines.join('\n');
}

export function formatTagReportAsText(report: TagReport): string {
  if (report.entries.length === 0) {
    return 'No tag/version changes detected.';
  }
  const lines: string[] = ['Package Tag Changes:', ''];
  for (const entry of report.entries) {
    lines.push(formatEntryAsText(entry));
  }
  lines.push('');
  lines.push(
    `Summary: +${report.totalAdded} added, -${report.totalRemoved} removed`
  );
  return lines.join('\n');
}

function formatEntryAsMarkdown(entry: TagEntry): string {
  const lines: string[] = [`- **${entry.name}**`];
  for (const t of entry.added) lines.push(`  - \`+${t}\``);
  for (const t of entry.removed) lines.push(`  - \`-${t}\``);
  return lines.join('\n');
}

export function formatTagReportAsMarkdown(report: TagReport): string {
  if (report.entries.length === 0) {
    return '_No tag/version changes detected._';
  }
  const lines: string[] = ['## Package Tag Changes', ''];
  for (const entry of report.entries) {
    lines.push(formatEntryAsMarkdown(entry));
  }
  lines.push('');
  lines.push(
    `**Summary:** +${report.totalAdded} added, -${report.totalRemoved} removed`
  );
  return lines.join('\n');
}

export function formatTagReport(
  report: TagReport,
  format: 'text' | 'markdown' = 'text'
): string {
  return format === 'markdown'
    ? formatTagReportAsMarkdown(report)
    : formatTagReportAsText(report);
}
