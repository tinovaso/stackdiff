import { DiffEntry } from './diffEngine';

export interface AgeInfo {
  name: string;
  version: string;
  publishedAt: Date | null;
  ageInDays: number | null;
}

export interface DependencyAgeResult {
  name: string;
  fromAge: AgeInfo | null;
  toAge: AgeInfo | null;
  ageDeltaDays: number | null;
}

export async function fetchPublishDate(
  name: string,
  version: string,
  registryUrl = 'https://registry.npmjs.org'
): Promise<Date | null> {
  try {
    const res = await fetch(`${registryUrl}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`);
    if (!res.ok) return null;
    const data = await res.json() as { time?: { [v: string]: string } };
    const raw = data?.time?.[version];
    return raw ? new Date(raw) : null;
  } catch {
    return null;
  }
}

export function ageInDays(date: Date | null): number | null {
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export async function resolveDependencyAge(
  entry: DiffEntry,
  registryUrl?: string
): Promise<DependencyAgeResult> {
  const fromDate = entry.from
    ? await fetchPublishDate(entry.name, entry.from, registryUrl)
    : null;
  const toDate = entry.to
    ? await fetchPublishDate(entry.name, entry.to, registryUrl)
    : null;

  const fromAge = entry.from
    ? { name: entry.name, version: entry.from, publishedAt: fromDate, ageInDays: ageInDays(fromDate) }
    : null;
  const toAge = entry.to
    ? { name: entry.name, version: entry.to, publishedAt: toDate, ageInDays: ageInDays(toDate) }
    : null;

  const ageDeltaDays =
    fromAge?.ageInDays != null && toAge?.ageInDays != null
      ? fromAge.ageInDays - toAge.ageInDays
      : null;

  return { name: entry.name, fromAge, toAge, ageDeltaDays };
}
