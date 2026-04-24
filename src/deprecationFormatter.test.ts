import {
  formatDeprecationReportAsText,
  formatDeprecationReportAsMarkdown,
  formatDeprecationReport,
} from "./deprecationFormatter";
import { DeprecationReport } from "./deprecationDetector";

const emptyReport: DeprecationReport = {
  deprecated: [],
  total: 0,
  checkedCount: 5,
};

const filledReport: DeprecationReport = {
  deprecated: [
    { name: "request", version: "2.88.2", message: "Use a modern HTTP client." },
    { name: "jade", version: "1.11.0", message: "Renamed to pug." },
  ],
  total: 2,
  checkedCount: 10,
};

describe("formatDeprecationReportAsText", () => {
  it("shows no deprecated message when list is empty", () => {
    const output = formatDeprecationReportAsText(emptyReport);
    expect(output).toContain("No deprecated packages found");
  });

  it("includes counts in header", () => {
    const output = formatDeprecationReportAsText(filledReport);
    expect(output).toContain("2 deprecated");
    expect(output).toContain("10 checked");
  });

  it("lists each deprecated package", () => {
    const output = formatDeprecationReportAsText(filledReport);
    expect(output).toContain("request@2.88.2");
    expect(output).toContain("jade@1.11.0");
  });

  it("includes deprecation messages", () => {
    const output = formatDeprecationReportAsText(filledReport);
    expect(output).toContain("Renamed to pug");
  });
});

describe("formatDeprecationReportAsMarkdown", () => {
  it("renders a markdown table header", () => {
    const output = formatDeprecationReportAsMarkdown(filledReport);
    expect(output).toContain("| Package | Version | Message |");
  });

  it("renders package names in code blocks", () => {
    const output = formatDeprecationReportAsMarkdown(filledReport);
    expect(output).toContain("`request`");
  });

  it("shows italic message for empty list", () => {
    const output = formatDeprecationReportAsMarkdown(emptyReport);
    expect(output).toContain("_No deprecated packages found._");
  });
});

describe("formatDeprecationReport", () => {
  it("defaults to text format", () => {
    const output = formatDeprecationReport(filledReport);
    expect(output).toContain("Deprecation Report");
    expect(output).not.toContain("##");
  });

  it("uses markdown format when specified", () => {
    const output = formatDeprecationReport(filledReport, "markdown");
    expect(output).toContain("## Deprecation Report");
  });
});
