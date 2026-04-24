import { DeprecationReport, DeprecationEntry } from "./deprecationDetector";

function formatEntryAsText(entry: DeprecationEntry): string {
  return `  ⚠  ${entry.name}@${entry.version}\n     ${entry.message}`;
}

function formatEntryAsMarkdown(entry: DeprecationEntry): string {
  return `| \`${entry.name}\` | \`${entry.version}\` | ${entry.message} |`;
}

export function formatDeprecationReportAsText(
  report: DeprecationReport
): string {
  const lines: string[] = [];
  lines.push(`Deprecation Report (${report.total} deprecated / ${report.checkedCount} checked)`);
  lines.push("-".repeat(60));

  if (report.deprecated.length === 0) {
    lines.push("  No deprecated packages found.");
  } else {
    for (const entry of report.deprecated) {
      lines.push(formatEntryAsText(entry));
    }
  }

  return lines.join("\n");
}

export function formatDeprecationReportAsMarkdown(
  report: DeprecationReport
): string {
  const lines: string[] = [];
  lines.push(`## Deprecation Report`);
  lines.push(``);
  lines.push(`**${report.total}** deprecated out of **${report.checkedCount}** checked.`);
  lines.push(``);

  if (report.deprecated.length === 0) {
    lines.push("_No deprecated packages found._");
  } else {
    lines.push("| Package | Version | Message |");
    lines.push("|---------|---------|---------|" );
    for (const entry of report.deprecated) {
      lines.push(formatEntryAsMarkdown(entry));
    }
  }

  return lines.join("\n");
}

export function formatDeprecationReport(
  report: DeprecationReport,
  format: "text" | "markdown" = "text"
): string {
  if (format === "markdown") {
    return formatDeprecationReportAsMarkdown(report);
  }
  return formatDeprecationReportAsText(report);
}
