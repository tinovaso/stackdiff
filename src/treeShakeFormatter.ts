import { TreeShakeReport, TreeShakeResult } from './treeShakeAnalyzer';

function sideEffectsLabel(sideEffects: boolean | string[]): string {
  if (Array.isArray(sideEffects)) return sideEffects.length === 0 ? 'none' : sideEffects.join(', ');
  return 'yes';
}

export function formatResultAsText(r: TreeShakeResult): string {
  const esm = r.esModuleCompatible ? '✓ ESM' : '✗ CJS';
  const se = `side-effects: ${sideEffectsLabel(r.sideEffects)}`;
  const savings = r.savingsKb > 0 ? `saves ~${r.savingsKb}kb (${r.savingsPercent}%)` : 'no savings';
  return `  ${r.name}@${r.version}  [${esm}]  [${se}]  ${savings}`;
}

export function formatTreeShakeReportAsText(report: TreeShakeReport): string {
  const lines: string[] = ['Tree-Shake Analysis', '==================='];
  for (const r of report.results) {
    lines.push(formatResultAsText(r));
  }
  lines.push('');
  lines.push(`Total original: ${report.totalOriginalKb} kb`);
  lines.push(`After tree-shaking: ${report.totalShakedKb} kb`);
  lines.push(`Estimated savings: ${report.totalSavingsKb} kb (${report.totalSavingsPercent}%)`);
  return lines.join('\n');
}

export function formatTreeShakeReportAsMarkdown(report: TreeShakeReport): string {
  const lines: string[] = [
    '## Tree-Shake Analysis',
    '',
    '| Package | ESM | Side Effects | Original (kb) | Shaked (kb) | Savings |',
    '|---------|-----|--------------|---------------|-------------|---------|',
  ];
  for (const r of report.results) {
    const esm = r.esModuleCompatible ? '✓' : '✗';
    const se = sideEffectsLabel(r.sideEffects);
    lines.push(
      `| ${r.name}@${r.version} | ${esm} | ${se} | ${r.originalEstimateKb} | ${r.treeShakedEstimateKb} | ${r.savingsKb} kb (${r.savingsPercent}%) |`
    );
  }
  lines.push('');
  lines.push(`**Total original:** ${report.totalOriginalKb} kb  `);
  lines.push(`**After tree-shaking:** ${report.totalShakedKb} kb  `);
  lines.push(`**Estimated savings:** ${report.totalSavingsKb} kb (${report.totalSavingsPercent}%)`);
  return lines.join('\n');
}

export function formatTreeShakeReport(report: TreeShakeReport, format: 'text' | 'markdown' = 'text'): string {
  return format === 'markdown'
    ? formatTreeShakeReportAsMarkdown(report)
    : formatTreeShakeReportAsText(report);
}
