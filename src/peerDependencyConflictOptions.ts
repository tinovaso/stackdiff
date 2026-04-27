export interface PeerConflictOptions {
  format: 'text' | 'markdown';
  onlyMissing: boolean;
  onlyMismatch: boolean;
}

export function parsePeerConflictOptions(args: string[]): PeerConflictOptions {
  const format = args.includes('--markdown') ? 'markdown' : 'text';
  const onlyMissing = args.includes('--only-missing');
  const onlyMismatch = args.includes('--only-mismatch');
  return { format, onlyMissing, onlyMismatch };
}

export function applyPeerConflictFilter(
  conflicts: import('./peerDependencyConflictDetector').PeerConflict[],
  options: PeerConflictOptions
): import('./peerDependencyConflictDetector').PeerConflict[] {
  if (options.onlyMissing) return conflicts.filter(c => c.conflict === 'missing');
  if (options.onlyMismatch) return conflicts.filter(c => c.conflict === 'mismatch');
  return conflicts;
}
