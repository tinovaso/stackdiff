import { DiffResult } from './diffEngine';
import { SemverGroup } from './semverGroup';

export interface ChangelogEntry {
  name: string;
  from: string | null;
  to: string | null;
  changeType: 'added' | 'removed' | 'upgraded' | 'downgraded';
  semverChange: SemverGroup;
}

export interface ChangelogExport {
  generatedAt: string;
  totalChanges: number;
  entries: ChangelogEntry[];
}

export function buildChangelogEntries(diff: DiffResult[]): ChangelogEntry[] {
  return diff.map((item) => {
    let changeType: ChangelogEntry['changeType'];

    if (item.type === 'added') {
      changeType = 'added';
    } else if (item.type === 'removed') {
      changeType = 'removed';
    } else if (item.versionChange === 'downgrade') {
      changeType = 'downgraded';
    } else {
      changeType = 'upgraded';
    }

    return {
      name: item.name,
      from: item.versionA ?? null,
      to: item.versionB ?? null,
      changeType,
      semverChange: item.semverGroup ?? 'none',
    };
  });
}

export function formatChangelogAsMarkdown(changelog: ChangelogExport): string {
  const lines: string[] = [
    `# Dependency Changelog`,
    ``,
    `_Generated at: ${changelog.generatedAt}_`,
    ``,
    `**Total changes:** ${changelog.totalChanges}`,
    ``,
    `| Package | Change | From | To | Semver |`,
    `|---------|--------|------|----|--------|`,
  ];

  for (const entry of changelog.entries) {
    const from = entry.from ?? '—';
    const to = entry.to ?? '—';
    lines.push(
      `| ${entry.name} | ${entry.changeType} | ${from} | ${to} | ${entry.semverChange} |`
    );
  }

  return lines.join('\n');
}

export function exportChangelog(
  diff: DiffResult[],
  format: 'json' | 'markdown' = 'markdown'
): string {
  const entries = buildChangelogEntries(diff);
  const changelog: ChangelogExport = {
    generatedAt: new Date().toISOString(),
    totalChanges: entries.length,
    entries,
  };

  if (format === 'json') {
    return JSON.stringify(changelog, null, 2);
  }

  return formatChangelogAsMarkdown(changelog);
}
