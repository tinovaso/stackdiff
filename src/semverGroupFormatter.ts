import { SemverGroupResult, SemverGroupType } from './semverGroup';

const GROUP_LABELS: Record<SemverGroupType, string> = {
  major: '🔴 Major',
  minor: '🟡 Minor',
  patch: '🟢 Patch',
  prerelease: '🔵 Prerelease',
  unknown: '⚪ Unknown',
};

const GROUP_ORDER: SemverGroupType[] = ['major', 'minor', 'patch', 'prerelease', 'unknown'];

export function formatSemverGroups(
  groups: Map<SemverGroupType, SemverGroupResult[]>,
  format: 'text' | 'markdown' = 'text'
): string {
  const lines: string[] = [];

  for (const key of GROUP_ORDER) {
    const entries = groups.get(key);
    if (!entries || entries.length === 0) continue;

    const label = GROUP_LABELS[key];
    if (format === 'markdown') {
      lines.push(`### ${label} (${entries.length})`);
      lines.push('| Package | From | To |');
      lines.push('|---------|------|----|');
      for (const e of entries) {
        lines.push(`| ${e.name} | ${e.from} | ${e.to} |`);
      }
    } else {
      lines.push(`${label} (${entries.length}):`);
      for (const e of entries) {
        lines.push(`  ${e.name}: ${e.from} → ${e.to}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}
