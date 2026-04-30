import { SizeComparisonReport, SizeEntry } from './packageSizeComparator';

function deltaLabel(entry: SizeEntry): string {
  if (entry.delta === null) return '';
  const sign = entry.delta >= 0 ? '+' : '';
  const pct =
    entry.percentChange !== null ? ` (${entry.delta >= 0 ? '+' : ''}${entry.percentChange}%)` : '';
  return `${sign}${entry.delta} KB${pct}`;
}

function sizeOrDash(val: number | null): string {
  return val !== null ? `${val} KB` : '—';
}

export function formatSizeReportAsText(report: SizeComparisonReport): string {
  const lines: string[] = ['Package Size Comparison', '======================='];
  for (const entry of report.entries) {
    const parts = [
      entry.name.padEnd(40),
      sizeOrDash(entry.sizeA).padStart(10),
      '→',
      sizeOrDash(entry.sizeB).padStart(10),
    ];
    const delta = deltaLabel(entry);
    if (delta) parts.push(`  ${delta}`);
    lines.push(parts.join(' '));
  }
  lines.push('');
  const totalSign = report.totalDelta >= 0 ? '+' : '';
  lines.push(
    `Total: ${report.totalSizeA} KB → ${report.totalSizeB} KB  (${totalSign}${report.totalDelta} KB)`
  );
  return lines.join('\n');
}

export function formatSizeReportAsMarkdown(report: SizeComparisonReport): string {
  const lines: string[] = [
    '## Package Size Comparison',
    '',
    '| Package | Size A | Size B | Delta |',
    '|---------|--------|--------|-------|',
  ];
  for (const entry of report.entries) {
    lines.push(
      `| ${entry.name} | ${sizeOrDash(entry.sizeA)} | ${sizeOrDash(entry.sizeB)} | ${deltaLabel(entry) || '—'} |`
    );
  }
  lines.push('');
  const totalSign = report.totalDelta >= 0 ? '+' : '';
  lines.push(
    `**Total:** ${report.totalSizeA} KB → ${report.totalSizeB} KB **(${totalSign}${report.totalDelta} KB)**`
  );
  return lines.join('\n');
}

export function formatSizeReport(
  report: SizeComparisonReport,
  format: 'text' | 'markdown' = 'text'
): string {
  return format === 'markdown'
    ? formatSizeReportAsMarkdown(report)
    : formatSizeReportAsText(report);
}
