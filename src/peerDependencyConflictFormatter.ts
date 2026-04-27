import { PeerConflict, PeerConflictReport } from './peerDependencyConflictDetector';

function conflictSymbol(conflict: PeerConflict['conflict']): string {
  return conflict === 'missing' ? '✗' : '⚠';
}

function formatConflictLine(c: PeerConflict): string {
  const sym = conflictSymbol(c.conflict);
  const installed = c.installedVersion ? `installed: ${c.installedVersion}` : 'not installed';
  return `  ${sym} ${c.package} (required by ${c.requiredBy}: ${c.requiredRange}, ${installed})`;
}

export function formatPeerConflictReportAsText(report: PeerConflictReport): string {
  if (report.totalConflicts === 0) {
    return 'No peer dependency conflicts detected.';
  }
  const lines: string[] = [
    `Peer Dependency Conflicts: ${report.totalConflicts} (missing: ${report.missingCount}, mismatch: ${report.mismatchCount})`,
  ];
  for (const c of report.conflicts) {
    lines.push(formatConflictLine(c));
  }
  return lines.join('\n');
}

export function formatPeerConflictReportAsMarkdown(report: PeerConflictReport): string {
  if (report.totalConflicts === 0) {
    return '_No peer dependency conflicts detected._';
  }
  const lines: string[] = [
    `## Peer Dependency Conflicts`,
    ``,
    `| Package | Required By | Required Range | Installed | Type |`,
    `|---------|-------------|----------------|-----------|------|`,
  ];
  for (const c of report.conflicts) {
    const installed = c.installedVersion ?? '—';
    lines.push(`| ${c.package} | ${c.requiredBy} | ${c.requiredRange} | ${installed} | ${c.conflict} |`);
  }
  return lines.join('\n');
}

export function formatPeerConflictReport(report: PeerConflictReport, format: 'text' | 'markdown' = 'text'): string {
  return format === 'markdown'
    ? formatPeerConflictReportAsMarkdown(report)
    : formatPeerConflictReportAsText(report);
}
