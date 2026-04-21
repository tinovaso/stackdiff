import { PeerDependencyReport, PeerDependencyIssue } from './peerDependencyChecker';

function statusSymbol(status: PeerDependencyIssue['status']): string {
  switch (status) {
    case 'missing':      return '✗ MISSING';
    case 'incompatible': return '⚠ INCOMPATIBLE';
    case 'satisfied':    return '✓ OK';
  }
}

export function formatPeerReportAsText(report: PeerDependencyReport): string {
  if (report.issues.length === 0) return 'No peer dependencies to check.\n';

  const lines: string[] = ['Peer Dependency Check', '====================='];

  for (const issue of report.issues) {
    const resolved = issue.resolvedVersion ?? 'not installed';
    lines.push(`  ${statusSymbol(issue.status).padEnd(16)} ${issue.package}  required: ${issue.requiredRange}  resolved: ${resolved}`);
  }

  lines.push('');
  lines.push(`Summary: ${report.totalSatisfied} satisfied, ${report.totalIncompatible} incompatible, ${report.totalMissing} missing`);
  return lines.join('\n') + '\n';
}

export function formatPeerReportAsMarkdown(report: PeerDependencyReport): string {
  if (report.issues.length === 0) return '_No peer dependencies to check._\n';

  const lines: string[] = [
    '## Peer Dependency Check',
    '',
    '| Package | Required | Resolved | Status |',
    '|---------|----------|----------|--------|',
  ];

  for (const issue of report.issues) {
    const resolved = issue.resolvedVersion ?? '—';
    lines.push(`| \`${issue.package}\` | \`${issue.requiredRange}\` | \`${resolved}\` | ${statusSymbol(issue.status)} |`);
  }

  lines.push('');
  lines.push(`**Summary:** ${report.totalSatisfied} satisfied · ${report.totalIncompatible} incompatible · ${report.totalMissing} missing`);
  return lines.join('\n') + '\n';
}

export function formatPeerReport(report: PeerDependencyReport, format: 'text' | 'markdown'): string {
  return format === 'markdown' ? formatPeerReportAsMarkdown(report) : formatPeerReportAsText(report);
}
