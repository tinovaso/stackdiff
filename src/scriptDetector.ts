import { PackageJson } from './packageParser';

export interface ScriptEntry {
  name: string;
  command: string;
  onlyIn: 'a' | 'b' | 'both';
  changed: boolean;
}

export interface ScriptDiffReport {
  entries: ScriptEntry[];
  addedCount: number;
  removedCount: number;
  changedCount: number;
  unchangedCount: number;
}

export function diffScripts(
  pkgA: PackageJson,
  pkgB: PackageJson
): ScriptDiffReport {
  const scriptsA: Record<string, string> = (pkgA as any).scripts ?? {};
  const scriptsB: Record<string, string> = (pkgB as any).scripts ?? {};

  const allKeys = new Set([...Object.keys(scriptsA), ...Object.keys(scriptsB)]);
  const entries: ScriptEntry[] = [];

  let addedCount = 0;
  let removedCount = 0;
  let changedCount = 0;
  let unchangedCount = 0;

  for (const name of Array.from(allKeys).sort()) {
    const inA = Object.prototype.hasOwnProperty.call(scriptsA, name);
    const inB = Object.prototype.hasOwnProperty.call(scriptsB, name);

    if (inA && inB) {
      const changed = scriptsA[name] !== scriptsB[name];
      entries.push({
        name,
        command: scriptsB[name],
        onlyIn: 'both',
        changed,
      });
      if (changed) changedCount++;
      else unchangedCount++;
    } else if (inA) {
      entries.push({ name, command: scriptsA[name], onlyIn: 'a', changed: false });
      removedCount++;
    } else {
      entries.push({ name, command: scriptsB[name], onlyIn: 'b', changed: false });
      addedCount++;
    }
  }

  return { entries, addedCount, removedCount, changedCount, unchangedCount };
}

export function hasScriptDifferences(report: ScriptDiffReport): boolean {
  return report.addedCount > 0 || report.removedCount > 0 || report.changedCount > 0;
}
