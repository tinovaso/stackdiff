import type { CircularDependencyReport, CircularPath } from "./circularDependency";

function formatCycleLine(path: CircularPath): string {
  return path.cycle.join(" → ");
}

export function formatCircularReportAsText(
  report: CircularDependencyReport
): string {
  if (!report.hasCycles) {
    return "No circular dependencies detected.\n";
  }

  const lines: string[] = [
    `Found ${report.totalCycles} circular dependency cycle(s):`,
    "",
  ];

  report.cycles.forEach((path, index) => {
    lines.push(`  ${index + 1}. ${formatCycleLine(path)} (length: ${path.length})`);
  });

  return lines.join("\n") + "\n";
}

export function formatCircularReportAsMarkdown(
  report: CircularDependencyReport
): string {
  if (!report.hasCycles) {
    return "## Circular Dependencies\n\n_No circular dependencies detected._\n";
  }

  const lines: string[] = [
    "## Circular Dependencies",
    "",
    `**${report.totalCycles} cycle(s) detected:**`,
    "",
  ];

  report.cycles.forEach((path, index) => {
    lines.push(`${index + 1}. \`${formatCycleLine(path)}\` _(length: ${path.length})_`);
  });

  return lines.join("\n") + "\n";
}

export function formatCircularReport(
  report: CircularDependencyReport,
  format: "text" | "markdown" = "text"
): string {
  if (format === "markdown") {
    return formatCircularReportAsMarkdown(report);
  }
  return formatCircularReportAsText(report);
}
