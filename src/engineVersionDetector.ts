import { PackageJson } from './packageParser';

export interface EngineRequirement {
  name: string;
  required: string;
  side: 'a' | 'b';
}

export interface EngineVersionDiff {
  name: string;
  versionA: string | undefined;
  versionB: string | undefined;
  changed: boolean;
}

export interface EngineVersionReport {
  diffs: EngineVersionDiff[];
  added: EngineRequirement[];
  removed: EngineRequirement[];
  changed: EngineVersionDiff[];
}

export function extractEngines(pkg: PackageJson): Record<string, string> {
  return (pkg as any).engines ?? {};
}

export function diffEngineVersions(
  pkgA: PackageJson,
  pkgB: PackageJson
): EngineVersionReport {
  const enginesA = extractEngines(pkgA);
  const enginesB = extractEngines(pkgB);

  const allKeys = new Set([...Object.keys(enginesA), ...Object.keys(enginesB)]);

  const diffs: EngineVersionDiff[] = [];
  const added: EngineRequirement[] = [];
  const removed: EngineRequirement[] = [];
  const changed: EngineVersionDiff[] = [];

  for (const name of allKeys) {
    const versionA = enginesA[name];
    const versionB = enginesB[name];
    const isChanged = versionA !== versionB;

    const diff: EngineVersionDiff = { name, versionA, versionB, changed: isChanged };
    diffs.push(diff);

    if (versionA === undefined && versionB !== undefined) {
      added.push({ name, required: versionB, side: 'b' });
    } else if (versionA !== undefined && versionB === undefined) {
      removed.push({ name, required: versionA, side: 'a' });
    } else if (isChanged) {
      changed.push(diff);
    }
  }

  return { diffs, added, removed, changed };
}

export function buildEngineVersionReport(report: EngineVersionReport): string {
  const lines: string[] = ['Engine Version Differences:'];

  if (report.added.length === 0 && report.removed.length === 0 && report.changed.length === 0) {
    lines.push('  No engine version differences found.');
    return lines.join('\n');
  }

  for (const entry of report.added) {
    lines.push(`  + ${entry.name}: (none) → ${entry.required}`);
  }
  for (const entry of report.removed) {
    lines.push(`  - ${entry.name}: ${entry.required} → (none)`);
  }
  for (const entry of report.changed) {
    lines.push(`  ~ ${entry.name}: ${entry.versionA} → ${entry.versionB}`);
  }

  return lines.join('\n');
}
