import { PackageJson } from './packageParser';

export type ProvenanceSource = 'npm' | 'github' | 'local' | 'git' | 'unknown';

export interface ProvenanceEntry {
  name: string;
  version: string;
  source: ProvenanceSource;
  raw: string;
  side: 'a' | 'b' | 'both';
}

export interface ProvenanceReport {
  entries: ProvenanceEntry[];
  summary: Record<ProvenanceSource, number>;
}

export function classifyProvenance(version: string): ProvenanceSource {
  if (/^\d/.test(version) || /^[~^*]/.test(version)) return 'npm';
  if (version.startsWith('github:') || version.includes('/') && !version.startsWith('.')) return 'github';
  if (version.startsWith('file:') || version.startsWith('.')) return 'local';
  if (version.startsWith('git+') || version.startsWith('git://') || version.startsWith('https://')) return 'git';
  return 'unknown';
}

export function detectProvenance(
  pkgA: PackageJson,
  pkgB: PackageJson
): ProvenanceReport {
  const depsA = { ...(pkgA.dependencies ?? {}), ...(pkgA.devDependencies ?? {}) };
  const depsB = { ...(pkgB.dependencies ?? {}), ...(pkgB.devDependencies ?? {}) };

  const allNames = new Set([...Object.keys(depsA), ...Object.keys(depsB)]);
  const entries: ProvenanceEntry[] = [];

  for (const name of allNames) {
    const verA = depsA[name];
    const verB = depsB[name];

    if (verA && verB) {
      const src = classifyProvenance(verB);
      if (src !== 'npm') {
        entries.push({ name, version: verB, source: src, raw: verB, side: 'both' });
      }
    } else if (verA) {
      const src = classifyProvenance(verA);
      if (src !== 'npm') {
        entries.push({ name, version: verA, source: src, raw: verA, side: 'a' });
      }
    } else if (verB) {
      const src = classifyProvenance(verB);
      if (src !== 'npm') {
        entries.push({ name, version: verB, source: src, raw: verB, side: 'b' });
      }
    }
  }

  const summary: Record<ProvenanceSource, number> = { npm: 0, github: 0, local: 0, git: 0, unknown: 0 };
  for (const e of entries) summary[e.source]++;

  return { entries, summary };
}
