import { PackageJson } from './packageParser';

export interface MissingPeerEntry {
  package: string;
  requiredBy: string;
  requiredRange: string;
  installedVersion: string | null;
}

export interface MissingPeerReport {
  missing: MissingPeerEntry[];
  total: number;
}

export function detectMissingPeers(
  packages: Record<string, PackageJson>,
  installed: Record<string, string>
): MissingPeerReport {
  const missing: MissingPeerEntry[] = [];

  for (const [pkgName, pkgJson] of Object.entries(packages)) {
    const peers = pkgJson.peerDependencies ?? {};
    for (const [peer, range] of Object.entries(peers)) {
      const installedVersion = installed[peer] ?? null;
      if (installedVersion === null) {
        missing.push({
          package: peer,
          requiredBy: pkgName,
          requiredRange: range,
          installedVersion: null,
        });
      }
    }
  }

  return { missing, total: missing.length };
}

export function buildMissingPeerReport(
  packages: Record<string, PackageJson>,
  installed: Record<string, string>
): MissingPeerReport {
  return detectMissingPeers(packages, installed);
}
