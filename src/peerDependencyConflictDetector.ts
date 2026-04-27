import { DiffEntry } from './diffEngine';

export interface PeerConflict {
  package: string;
  requiredBy: string;
  requiredRange: string;
  installedVersion: string | null;
  conflict: 'missing' | 'mismatch';
}

export interface PeerConflictReport {
  conflicts: PeerConflict[];
  totalConflicts: number;
  missingCount: number;
  mismatchCount: number;
}

export function detectPeerConflicts(
  deps: Record<string, string>,
  peerRequirements: Record<string, Record<string, string>>
): PeerConflict[] {
  const conflicts: PeerConflict[] = [];

  for (const [pkg, peers] of Object.entries(peerRequirements)) {
    for (const [peerName, requiredRange] of Object.entries(peers)) {
      const installedVersion = deps[peerName] ?? null;
      if (!installedVersion) {
        conflicts.push({ package: peerName, requiredBy: pkg, requiredRange, installedVersion: null, conflict: 'missing' });
      } else {
        const { satisfiesRange } = require('./peerDependencyChecker');
        if (!satisfiesRange(installedVersion, requiredRange)) {
          conflicts.push({ package: peerName, requiredBy: pkg, requiredRange, installedVersion, conflict: 'mismatch' });
        }
      }
    }
  }

  return conflicts;
}

export function buildPeerConflictReport(
  deps: Record<string, string>,
  peerRequirements: Record<string, Record<string, string>>
): PeerConflictReport {
  const conflicts = detectPeerConflicts(deps, peerRequirements);
  return {
    conflicts,
    totalConflicts: conflicts.length,
    missingCount: conflicts.filter(c => c.conflict === 'missing').length,
    mismatchCount: conflicts.filter(c => c.conflict === 'mismatch').length,
  };
}
