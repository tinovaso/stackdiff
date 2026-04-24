import { DiffEntry } from "./diffEngine";

export type GroupKey = "dependencies" | "devDependencies" | "peerDependencies" | "optionalDependencies" | "unknown";

export interface DependencyGroup {
  key: GroupKey;
  label: string;
  entries: DiffEntry[];
}

export interface GroupedDiff {
  groups: DependencyGroup[];
  totalEntries: number;
}

const GROUP_LABELS: Record<GroupKey, string> = {
  dependencies: "Dependencies",
  devDependencies: "Dev Dependencies",
  peerDependencies: "Peer Dependencies",
  optionalDependencies: "Optional Dependencies",
  unknown: "Unknown",
};

export function classifyEntry(entry: DiffEntry, sourceHints: Record<string, GroupKey>): GroupKey {
  return sourceHints[entry.name] ?? "unknown";
}

export function groupDiffByType(
  entries: DiffEntry[],
  sourceHints: Record<string, GroupKey>
): GroupedDiff {
  const buckets = new Map<GroupKey, DiffEntry[]>();

  for (const entry of entries) {
    const key = classifyEntry(entry, sourceHints);
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key)!.push(entry);
  }

  const order: GroupKey[] = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
    "unknown",
  ];

  const groups: DependencyGroup[] = order
    .filter((k) => buckets.has(k))
    .map((k) => ({
      key: k,
      label: GROUP_LABELS[k],
      entries: buckets.get(k)!,
    }));

  return { groups, totalEntries: entries.length };
}

export function buildSourceHints(
  packageJson: Record<string, unknown>
): Record<string, GroupKey> {
  const hints: Record<string, GroupKey> = {};
  const sections: GroupKey[] = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];
  for (const section of sections) {
    const block = packageJson[section];
    if (block && typeof block === "object") {
      for (const name of Object.keys(block as object)) {
        hints[name] = section;
      }
    }
  }
  return hints;
}
