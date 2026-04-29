import { DevDependencyReport, DevDependencyEntry } from './devDependencyDetector';

function statusSymbol(status: DevDependencyEntry['status']): string {
  switch (status) {
    case 'added':     return '+';
    case 'removed':   return '-';
    case 'changed':   return '~';
    case 'unchanged': return ' ';
  }
}

function formatEntryAsText(entry: DevDependencyEntry): string {
  const sym = statusSymbol(entry.status);
  if (entry.status === 'added') {
    return `  ${sym} ${entry.name}  (new: ${entry.versionB})`;
  }
  if (entry.status === 'removed') {
    return `  ${sym} ${entry.name}  (was: ${entry.versionA})`;
  }
  if (entry.status === 'changed') {
    return `  ${sym} ${entry.name}  ${entry.versionA} → ${entry.versionB}`;
  }
  return `    ${entry.name}  ${entry.versionA}`;
}

function formatEntryAsMarkdown(entry: DevDependencyEntry): string {
  const sym = statusSymbol(entry.status);
  if (entry.status === 'added')   return `| \`${entry.name}\` | — | \`${entry.versionB}\` | added |`;
  if (entry.status === 'removed') return `| \`${entry.name}\` | \`${entry.versionA}\` | — | removed |`;
  if (entry.status === 'changed') return `| \`${entry.name}\` | \`${entry.versionA}\` | \`${entry.versionB}\` | changed |`;
  return `| \`${entry.name}\` | \`${entry.versionA}\` | \`${entry.versionA}\` | unchanged |`;
}

export function formatDevReportAsText(report: DevDependencyReport): string {
  const lines: string[] = ['devDependencies diff:'];
  const relevant = report.entries.filter(e => e.status !== 'unchanged');
  if (relevant.length === 0) lines.push('  (no changes)');
  else relevant.forEach(e => lines.push(formatEntryAsText(e)));
  lines.push(`\nSummary: +${report.totalAdded} added, -${report.totalRemoved} removed, ~${report.totalChanged} changed`);
  return lines.join('\n');
}

export function formatDevReportAsMarkdown(report: DevDependencyReport): string {
  const lines: string[] = [
    '## devDependencies Diff',
    '',
    '| Package | Version A | Version B | Status |',
    '|---------|-----------|-----------|--------|',
  ];
  const relevant = report.entries.filter(e => e.status !== 'unchanged');
  if (relevant.length === 0) lines.push('| — | — | — | no changes |');
  else relevant.forEach(e => lines.push(formatEntryAsMarkdown(e)));
  lines.push('');
  lines.push(`**Summary:** +${report.totalAdded} added, -${report.totalRemoved} removed, ~${report.totalChanged} changed`);
  return lines.join('\n');
}

export function formatDevReport(report: DevDependencyReport, format: 'text' | 'markdown'): string {
  return format === 'markdown' ? formatDevReportAsMarkdown(report) : formatDevReportAsText(report);
}
