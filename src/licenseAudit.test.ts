import { extractLicenses, groupByLicense, auditLicenses } from "./licenseAudit";
import { formatLicenseReport } from "./licenseAuditFormatter";

const deps = { react: "18.0.0", lodash: "4.17.21", "my-gpl-lib": "1.0.0" };
const licenseMap = {
  react: "MIT",
  lodash: "MIT",
  "my-gpl-lib": "GPL-3.0",
};

describe("extractLicenses", () => {
  it("maps packages to license entries", () => {
    const entries = extractLicenses(deps, licenseMap);
    expect(entries).toHaveLength(3);
    expect(entries.find((e) => e.name === "react")?.license).toBe("MIT");
  });

  it("marks unknown licenses", () => {
    const entries = extractLicenses({ unknown: "1.0.0" }, {});
    expect(entries[0].license).toBe("UNKNOWN");
  });
});

describe("groupByLicense", () => {
  it("groups packages by license", () => {
    const entries = extractLicenses(deps, licenseMap);
    const summary = groupByLicense(entries);
    expect(summary["MIT"]).toContain("react");
    expect(summary["MIT"]).toContain("lodash");
    expect(summary["GPL-3.0"]).toContain("my-gpl-lib");
  });
});

describe("auditLicenses", () => {
  it("flags disallowed licenses", () => {
    const report = auditLicenses(deps, licenseMap);
    expect(report.flagged.map((e) => e.name)).toContain("my-gpl-lib");
  });

  it("flags unknown licenses", () => {
    const report = auditLicenses({ unknown: "1.0.0" }, {});
    expect(report.flagged).toHaveLength(1);
  });

  it("returns no flagged for clean deps", () => {
    const report = auditLicenses({ react: "18.0.0" }, { react: "MIT" });
    expect(report.flagged).toHaveLength(0);
  });
});

describe("formatLicenseReport", () => {
  const report = auditLicenses(deps, licenseMap);

  it("formats as text", () => {
    const out = formatLicenseReport(report, "text");
    expect(out).toContain("License Audit Report");
    expect(out).toContain("my-gpl-lib");
  });

  it("formats as markdown", () => {
    const out = formatLicenseReport(report, "markdown");
    expect(out).toContain("# License Audit Report");
    expect(out).toContain("⚠ Flagged");
  });

  it("formats as json", () => {
    const out = formatLicenseReport(report, "json");
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty("flagged");
  });
});
