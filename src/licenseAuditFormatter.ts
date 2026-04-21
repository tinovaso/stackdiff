import { LicenseAuditReport } from "./licenseAudit";

export function formatLicenseReport(
  report: LicenseAuditReport,
  format: "text" | "json" | "markdown" = "text"
): string {
  if (format === "json") {
    return JSON.stringify(report, null, 2);
  }

  if (format === "markdown") {
    const lines: string[] = ["# License Audit Report\n"];
    lines.push("## All Licenses\n");
    for (const [license, pkgs] of Object.entries(report.summary)) {
      lines.push(`### ${license}`);
      pkgs.forEach((p) => lines.push(`- ${p}`));
    }
    if (report.flagged.length > 0) {
      lines.push("\n## ⚠ Flagged Packages\n");
      report.flagged.forEach((e) =>
        lines.push(`- **${e.name}** @ ${e.version} — ${e.license}`)
      );
    } else {
      lines.push("\n## ✅ No flagged packages");
    }
    return lines.join("\n");
  }

  // text
  const lines: string[] = ["License Audit Report", "===================="];
  for (const [license, pkgs] of Object.entries(report.summary)) {
    lines.push(`\n[${license}]`);
    pkgs.forEach((p) => lines.push(`  ${p}`));
  }
  if (report.flagged.length > 0) {
    lines.push("\nFlagged:");
    report.flagged.forEach((e) =>
      lines.push(`  ${e.name}@${e.version} (${e.license})`)
    );
  } else {
    lines.push("\nNo flagged packages.");
  }
  return lines.join("\n");
}
