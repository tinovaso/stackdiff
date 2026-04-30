import { OverrideEntry, OverrideReport } from './dependencyOverrideDetector';

function sideLabel(side: OverrideEntry['side']): string {
  if (side === 'A') return '[A only]';
  if (side === 'B') return '[B only]';
  return '[both]  ';
}

function formatEntryAsText(entry: OverrideEntry): string {
  const label = sideLabel(entry.side);
  if (entry.side === 'both' && entry.overrideA !== entry.overrideB) {
    return `  ${label} ${entry.name}: ${entry.overrideA} → ${entry.overrideB}`;
  }
  if (entry.side === 'both') {
    return `  ${label} ${entry.name}: ${entry.overrideA}`;
  }
  return `  ${label} ${entry.name}: ${entry.overriddenVersion}`;
}

function formatEntryAsMarkdown(entry: OverrideEntry): string {
  const label = sideLabel(entry.side).trim();
  if (entry.side === 'both' && entry.overrideA !== entry.overrideB) {
    return `| ${entry.name} | ${entry.overrideA} | ${entry.overrideB} | ${label} |`;
  }
  const ver = entry.side === 'A' ? entry.overrideA : entry.overrideB ?? entry.overrideA;
  return `| ${entry.name} | ${entry.side === 'A' ? ver : '-'} | ${entry.side === 'B' ? ver : '-'} | ${label} |`;
}

export function formatOverrideReportAsText(report: OverrideReport): string {
  if (report.entries.length === 0) return 'No overrides detected.';
  const lines = ['Dependency Overrides:', `  Package A: ${report.totalA} override(s)`, `  Package B: ${report.totalB} override(s)`, ''];
  for (const entry of report.entries) {
    lines.push(formatEntryAsText(entry));
  }
  return lines.join('\n');
}

export function formatOverrideReportAsMarkdown(report: OverrideReport): string {
  if (report.entries.length === 0) return '_No overrides detected._';
  const lines = [
    '## Dependency Overrides',
    `- Package A: **${report.totalA}** override(s)`,
    `- Package B: **${report.totalB}** override(s)`,
    '',
    '| Package | Version A | Version B | Present In |',
    '|---------|-----------|-----------|------------|',
  ];
  for (const entry of report.entries) {
    lines.push(formatEntryAsMarkdown(entry));
  }
  return lines.join('\n');
}

export function formatOverrideReport(report: OverrideReport, format: 'text' | 'markdown' = 'text'): string {
  return format === 'markdown'
    ? formatOverrideReportAsMarkdown(report)
    : formatOverrideReportAsText(report);
}
