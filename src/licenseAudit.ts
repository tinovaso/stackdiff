import { FlatDependencies } from "./packageParser";

export type LicenseEntry = {
  name: string;
  version: string;
  license: string;
};

export type LicenseAuditReport = {
  entries: LicenseEntry[];
  summary: Record<string, string[]>;
  flagged: LicenseEntry[];
};

const DEFAULT_DISALLOWED = ["GPL-2.0", "GPL-3.0", "AGPL-3.0", "LGPL-2.1"];

export function extractLicenses(
  deps: FlatDependencies,
  licenseMap: Record<string, string> = {}
): LicenseEntry[] {
  return Object.entries(deps).map(([name, version]) => ({
    name,
    version,
    license: licenseMap[name] ?? "UNKNOWN",
  }));
}

export function groupByLicense(
  entries: LicenseEntry[]
): Record<string, string[]> {
  const summary: Record<string, string[]> = {};
  for (const entry of entries) {
    if (!summary[entry.license]) {
      summary[entry.license] = [];
    }
    summary[entry.license].push(entry.name);
  }
  return summary;
}

export function auditLicenses(
  deps: FlatDependencies,
  licenseMap: Record<string, string> = {},
  disallowed: string[] = DEFAULT_DISALLOWED
): LicenseAuditReport {
  const entries = extractLicenses(deps, licenseMap);
  const summary = groupByLicense(entries);
  const flagged = entries.filter(
    (e) => disallowed.includes(e.license) || e.license === "UNKNOWN"
  );
  return { entries, summary, flagged };
}
