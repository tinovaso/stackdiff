import { ResolutionConflict, ResolutionConflictReport } from './resolutionConflictDetector';

function formatConflictAsText(conflict: ResolutionConflict): string {
  const [v1, v2] = conflict.versions;
  const [s1, s2] = conflict.sources;
  return `  ⚠  ${conflict.packageName}: ${s1}@${v1} vs ${s2}@${v2}`;
}

function formatConflictAsMarkdown(conflict: ResolutionConflict): string {
  const [v1, v2] = conflict.versions;
  const [s1, s2] = conflict.sources;
  return `| ${conflict.packageName} | ${s1}: \`${v1}\` | ${s2}: \`${v2}\` |`;
}

export function formatResolutionConflictReportAsText(
  report: ResolutionConflictReport
): string {
  if (!report.hasConflicts) {
    return 'No resolution conflicts detected.';
  }
  const lines = [
    `Resolution Conflicts (${report.totalConflicts}):`,
    ...report.conflicts.map(formatConflictAsText),
  ];
  return lines.join('\n');
}

export function formatResolutionConflictReportAsMarkdown(
  report: ResolutionConflictReport
): string {
  if (!report.hasConflicts) {
    return '_No resolution conflicts detected._';
  }
  const header = [
    `## Resolution Conflicts (${report.totalConflicts})`,
    '',
    '| Package | Source A | Source B |',
    '|---------|----------|----------|',
  ];
  const rows = report.conflicts.map(formatConflictAsMarkdown);
  return [...header, ...rows].join('\n');
}

export function formatResolutionConflictReport(
  report: ResolutionConflictReport,
  format: 'text' | 'markdown' = 'text'
): string {
  return format === 'markdown'
    ? formatResolutionConflictReportAsMarkdown(report)
    : formatResolutionConflictReportAsText(report);
}
