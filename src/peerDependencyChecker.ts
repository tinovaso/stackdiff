import { FlatDependencies } from './packageParser';

export interface PeerDependencyIssue {
  package: string;
  peerDep: string;
  requiredRange: string;
  resolvedVersion: string | null;
  status: 'missing' | 'incompatible' | 'satisfied';
}

export interface PeerDependencyReport {
  issues: PeerDependencyIssue[];
  totalMissing: number;
  totalIncompatible: number;
  totalSatisfied: number;
}

function satisfiesRange(version: string, range: string): boolean {
  // Simplified semver range check supporting ^, ~, >=, exact
  const clean = (v: string) => v.replace(/^[^\d]*/, '');
  const parts = (v: string) => clean(v).split('.').map(Number);

  const [major, minor, patch] = parts(version);

  if (range.startsWith('>=')) {
    const [rMaj, rMin, rPat] = parts(range.slice(2));
    return major > rMaj || (major === rMaj && minor > rMin) || (major === rMaj && minor === rMin && patch >= rPat);
  }
  if (range.startsWith('^')) {
    const [rMaj, rMin] = parts(range.slice(1));
    return major === rMaj && (minor > rMin || (minor === rMin && patch >= 0));
  }
  if (range.startsWith('~')) {
    const [rMaj, rMin, rPat] = parts(range.slice(1));
    return major === rMaj && minor === rMin && patch >= rPat;
  }
  return clean(version) === clean(range);
}

export function checkPeerDependencies(
  peerDeps: Record<string, string>,
  resolved: FlatDependencies
): PeerDependencyReport {
  const issues: PeerDependencyIssue[] = [];

  for (const [pkg, requiredRange] of Object.entries(peerDeps)) {
    const resolvedVersion = resolved[pkg] ?? null;
    let status: PeerDependencyIssue['status'];

    if (!resolvedVersion) {
      status = 'missing';
    } else if (satisfiesRange(resolvedVersion, requiredRange)) {
      status = 'satisfied';
    } else {
      status = 'incompatible';
    }

    issues.push({ package: pkg, peerDep: pkg, requiredRange, resolvedVersion, status });
  }

  return {
    issues,
    totalMissing: issues.filter(i => i.status === 'missing').length,
    totalIncompatible: issues.filter(i => i.status === 'incompatible').length,
    totalSatisfied: issues.filter(i => i.status === 'satisfied').length,
  };
}
