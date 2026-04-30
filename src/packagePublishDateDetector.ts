import { PackageJson } from './packageParser';

export interface PublishDateEntry {
  name: string;
  sideA: string | null;
  sideB: string | null;
  publishedAtA: string | null;
  publishedAtB: string | null;
  daysDelta: number | null;
}

export interface PublishDateReport {
  entries: PublishDateEntry[];
  totalCompared: number;
}

export function parsePublishDate(pkgMeta: Record<string, unknown>): string | null {
  if (typeof pkgMeta.time === 'object' && pkgMeta.time !== null) {
    const time = pkgMeta.time as Record<string, string>;
    const version = pkgMeta.version as string | undefined;
    if (version && time[version]) {
      return time[version];
    }
  }
  if (typeof pkgMeta.publishedAt === 'string') {
    return pkgMeta.publishedAt;
  }
  return null;
}

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function detectPublishDates(
  pkgA: PackageJson,
  pkgB: PackageJson,
  metaMap: Record<string, { a?: Record<string, unknown>; b?: Record<string, unknown> }>
): PublishDateReport {
  const depsA = pkgA.dependencies ?? {};
  const depsB = pkgB.dependencies ?? {};
  const allNames = new Set([...Object.keys(depsA), ...Object.keys(depsB)]);

  const entries: PublishDateEntry[] = [];

  for (const name of allNames) {
    const meta = metaMap[name] ?? {};
    const publishedAtA = meta.a ? parsePublishDate(meta.a) : null;
    const publishedAtB = meta.b ? parsePublishDate(meta.b) : null;
    const daysDelta =
      publishedAtA && publishedAtB ? daysBetween(publishedAtA, publishedAtB) : null;

    entries.push({
      name,
      sideA: depsA[name] ?? null,
      sideB: depsB[name] ?? null,
      publishedAtA,
      publishedAtB,
      daysDelta,
    });
  }

  return { entries, totalCompared: entries.length };
}
