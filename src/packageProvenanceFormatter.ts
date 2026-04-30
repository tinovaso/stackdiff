import { ProvenanceReport, ProvenanceEntry, ProvenanceSource } from './packageProvenance';

const SOURCE_LABELS: Record<ProvenanceSource, string> = {
  npm: 'npm',
  github: 'GitHub',
  local: 'Local',
  git: 'Git URL',
  unknown: 'Unknown',
};

const SOURCE_ICONS: Record<ProvenanceSource, string> = {
  npm: '📦',
  github: '🐙',
  local: '📁',
  git: '🔗',
  unknown: '❓',
};

function sideLabel(side: ProvenanceEntry['side']): string {
  if (side === 'a') return '[A only]';
  if (side === 'b') return '[B only]';
  return '[both]';
}

export function formatEntryAsText(entry: ProvenanceEntry): string {
  const icon = SOURCE_ICONS[entry.source];
  const label = SOURCE_LABELS[entry.source];
  return `  ${icon} ${entry.name}@${entry.version}  (${label})  ${sideLabel(entry.side)}`;
}

export function formatProvenanceReportAsText(report: ProvenanceReport): string {
  if (report.entries.length === 0) {
    return 'No non-npm provenance sources detected.\n';
  }
  const lines: string[] = ['Non-npm Dependency Sources:', ''];
  for (const entry of report.entries) {
    lines.push(formatEntryAsText(entry));
  }
  lines.push('');
  lines.push('Summary:');
  for (const [src, count] of Object.entries(report.summary)) {
    if (count > 0) lines.push(`  ${SOURCE_LABELS[src as ProvenanceSource]}: ${count}`);
  }
  return lines.join('\n') + '\n';
}

export function formatEntryAsMarkdown(entry: ProvenanceEntry): string {
  const label = SOURCE_LABELS[entry.source];
  return `| \`${entry.name}\` | \`${entry.version}\` | ${label} | ${sideLabel(entry.side)} |`;
}

export function formatProvenanceReportAsMarkdown(report: ProvenanceReport): string {
  if (report.entries.length === 0) {
    return '_No non-npm provenance sources detected._\n';
  }
  const lines: string[] = [
    '## Non-npm Dependency Sources',
    '',
    '| Package | Version | Source | Side |',
    '|---------|---------|--------|------|',
  ];
  for (const entry of report.entries) {
    lines.push(formatEntryAsMarkdown(entry));
  }
  return lines.join('\n') + '\n';
}

export function formatProvenanceReport(report: ProvenanceReport, format: 'text' | 'markdown' = 'text'): string {
  return format === 'markdown'
    ? formatProvenanceReportAsMarkdown(report)
    : formatProvenanceReportAsText(report);
}
