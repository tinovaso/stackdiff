import { DiffEntry } from './filter';

export type FilterSummary = {
  total: number;
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
};

export function summarizeFiltered(entries: DiffEntry[]): FilterSummary {
  const summary: FilterSummary = {
    total: entries.length,
    added: 0,
    removed: 0,
    changed: 0,
    unchanged: 0,
  };

  for (const entry of entries) {
    summary[entry.status]++;
  }

  return summary;
}

export function formatSummary(summary: FilterSummary): string {
  const parts: string[] = [
    `Total: ${summary.total}`,
    `Added: ${summary.added}`,
    `Removed: ${summary.removed}`,
    `Changed: ${summary.changed}`,
    `Unchanged: ${summary.unchanged}`,
  ];
  return parts.join('  |  ');
}

/**
 * Returns true if the summary contains any differences (added, removed, or changed entries).
 */
export function hasDifferences(summary: FilterSummary): boolean {
  return summary.added > 0 || summary.removed > 0 || summary.changed > 0;
}
