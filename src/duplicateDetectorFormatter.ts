import { DuplicateReport, DuplicateEntry } from './duplicateDetector';

function formatEntry(entry: DuplicateEntry): string {
  const [vA, vB] = entry.versions;
  const [srcA, srcB] = entry.sources;
  return `  ${entry.name}: ${srcA}@${vA} vs ${srcB}@${vB}`;
}

/**
 * Formats a duplicate report as plain text.
 */
export function formatDuplicateReportAsText(report: DuplicateReport): string {
  const lines: string[] = [];
  lines.push(`Duplicate Detection Report`);
  lines.push(`Total packages: ${report.totalPackages}`);
  lines.push(`Packages with version conflicts: ${report.duplicateCount}`);

  if (report.duplicates.length === 0) {
    lines.push('No version conflicts found.');
  } else {
    lines.push('');
    lines.push('Conflicts:');
    for (const entry of report.duplicates) {
      lines.push(formatEntry(entry));
    }
  }

  return lines.join('\n');
}

/**
 * Formats a duplicate report as Markdown.
 */
export function formatDuplicateReportAsMarkdown(report: DuplicateReport): string {
  const lines: string[] = [];
  lines.push('## Duplicate Detection Report');
  lines.push('');
  lines.push(`- **Total packages:** ${report.totalPackages}`);
  lines.push(`- **Version conflicts:** ${report.duplicateCount}`);

  if (report.duplicates.length > 0) {
    lines.push('');
    lines.push('| Package | Version A | Version B |');
    lines.push('|---------|-----------|-----------|');
    for (const entry of report.duplicates) {
      lines.push(`| ${entry.name} | ${entry.versions[0]} | ${entry.versions[1]} |`);
    }
  }

  return lines.join('\n');
}
