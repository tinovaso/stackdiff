import { DiffResult } from './diffEngine';

export type OutputFormat = 'text' | 'json' | 'markdown';

export function formatAsJson(diffs: DiffResult[]): string {
  return JSON.stringify(diffs, null, 2);
}

export function formatAsMarkdown(diffs: DiffResult[]): string {
  const lines: string[] = ['# Dependency Diff', ''];

  const added = diffs.filter(d => d.type === 'added');
  const removed = diffs.filter(d => d.type === 'removed');
  const changed = diffs.filter(d => d.type === 'changed');

  if (added.length > 0) {
    lines.push('## Added');
    added.forEach(d => lines.push(`- \`${d.name}\` @ ${d.versionB}`));
    lines.push('');
  }

  if (removed.length > 0) {
    lines.push('## Removed');
    removed.forEach(d => lines.push(`- \`${d.name}\` @ ${d.versionA}`));
    lines.push('');
  }

  if (changed.length > 0) {
    lines.push('## Changed');
    changed.forEach(d => lines.push(`- \`${d.name}\`: ${d.versionA} → ${d.versionB}`));
    lines.push('');
  }

  if (diffs.length === 0) {
    lines.push('_No differences found._');
  }

  return lines.join('\n');
}

export function formatAsText(diffs: DiffResult[]): string {
  if (diffs.length === 0) return 'No differences found.';
  return diffs
    .map(d => {
      if (d.type === 'added') return `+ ${d.name} @ ${d.versionB}`;
      if (d.type === 'removed') return `- ${d.name} @ ${d.versionA}`;
      return `~ ${d.name}: ${d.versionA} → ${d.versionB}`;
    })
    .join('\n');
}

export function format(diffs: DiffResult[], outputFormat: OutputFormat): string {
  switch (outputFormat) {
    case 'json': return formatAsJson(diffs);
    case 'markdown': return formatAsMarkdown(diffs);
    default: return formatAsText(diffs);
  }
}
