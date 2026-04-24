import { GroupedDiff, DependencyGroup } from "./dependencyGrouper";
import { DiffEntry } from "./diffEngine";

function entryLine(entry: DiffEntry): string {
  if (entry.status === "added") {
    return `  + ${entry.name}  (added: ${entry.versionB})`;
  }
  if (entry.status === "removed") {
    return `  - ${entry.name}  (removed: ${entry.versionA})`;
  }
  return `  ~ ${entry.name}  ${entry.versionA} → ${entry.versionB}`;
}

export function formatGroupedDiffAsText(grouped: GroupedDiff): string {
  if (grouped.totalEntries === 0) {
    return "No differences found.";
  }
  const lines: string[] = [];
  for (const group of grouped.groups) {
    lines.push(`[${group.label}]`);
    for (const entry of group.entries) {
      lines.push(entryLine(entry));
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function markdownEntryLine(entry: DiffEntry): string {
  if (entry.status === "added") {
    return `| \`${entry.name}\` | — | \`${entry.versionB}\` | added |`;
  }
  if (entry.status === "removed") {
    return `| \`${entry.name}\` | \`${entry.versionA}\` | — | removed |`;
  }
  return `| \`${entry.name}\` | \`${entry.versionA}\` | \`${entry.versionB}\` | changed |`;
}

function formatGroup(group: DependencyGroup): string {
  const lines: string[] = [
    `### ${group.label}`,
    "",
    "| Package | Before | After | Status |",
    "|---------|--------|-------|--------|",
    ...group.entries.map(markdownEntryLine),
    "",
  ];
  return lines.join("\n");
}

export function formatGroupedDiffAsMarkdown(grouped: GroupedDiff): string {
  if (grouped.totalEntries === 0) {
    return "_No differences found._";
  }
  return ["## Dependency Diff by Type", "", ...grouped.groups.map(formatGroup)]
    .join("\n")
    .trimEnd();
}

export function formatGroupedDiff(
  grouped: GroupedDiff,
  format: "text" | "markdown"
): string {
  return format === "markdown"
    ? formatGroupedDiffAsMarkdown(grouped)
    : formatGroupedDiffAsText(grouped);
}
