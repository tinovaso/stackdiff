import { FlatDependencyMap } from './packageParser';

export interface FreshnessEntry {
  name: string;
  version: string;
  latestVersion: string;
  daysBehind: number;
  freshnessScore: number; // 0-100, 100 = up to date
  status: 'fresh' | 'stale' | 'outdated';
}

export interface FreshnessReport {
  entries: FreshnessEntry[];
  averageScore: number;
  freshCount: number;
  staleCount: number;
  outdatedCount: number;
}

export function classifyFreshness(daysBehind: number): 'fresh' | 'stale' | 'outdated' {
  if (daysBehind <= 30) return 'fresh';
  if (daysBehind <= 180) return 'stale';
  return 'outdated';
}

export function computeFreshnessScore(daysBehind: number): number {
  if (daysBehind <= 0) return 100;
  if (daysBehind >= 365) return 0;
  return Math.max(0, Math.round(100 - (daysBehind / 365) * 100));
}

export function buildFreshnessReport(
  deps: FlatDependencyMap,
  latestVersions: Record<string, { version: string; publishedAt: string }>
): FreshnessReport {
  const now = Date.now();
  const entries: FreshnessEntry[] = [];

  for (const [name, version] of Object.entries(deps)) {
    const latest = latestVersions[name];
    if (!latest) continue;

    const publishedAt = new Date(latest.publishedAt).getTime();
    const daysBehind = Math.max(0, Math.floor((now - publishedAt) / (1000 * 60 * 60 * 24)));
    const freshnessScore = computeFreshnessScore(daysBehind);
    const status = classifyFreshness(daysBehind);

    entries.push({ name, version, latestVersion: latest.version, daysBehind, freshnessScore, status });
  }

  const averageScore =
    entries.length > 0
      ? Math.round(entries.reduce((sum, e) => sum + e.freshnessScore, 0) / entries.length)
      : 100;

  return {
    entries,
    averageScore,
    freshCount: entries.filter(e => e.status === 'fresh').length,
    staleCount: entries.filter(e => e.status === 'stale').length,
    outdatedCount: entries.filter(e => e.status === 'outdated').length,
  };
}
