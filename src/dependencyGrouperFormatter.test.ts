import { formatGroupedDiffAsText, formatGroupedDiffAsMarkdown, formatGroupedDiff } from "./dependencyGrouperFormatter";
import { GroupedDiff } from "./dependencyGrouper";

const emptyGrouped: GroupedDiff = { groups: [], totalEntries: 0 };

const sampleGrouped: GroupedDiff = {
  totalEntries: 3,
  groups: [
    {
      key: "dependencies",
      label: "Dependencies",
      entries: [
        { name: "lodash", status: "added", versionA: undefined, versionB: "4.17.21" },
        { name: "react", status: "changed", versionA: "17.0.0", versionB: "18.0.0" },
      ],
    },
    {
      key: "devDependencies",
      label: "Dev Dependencies",
      entries: [
        { name: "moment", status: "removed", versionA: "2.29.0", versionB: undefined },
      ],
    },
  ],
};

describe("formatGroupedDiffAsText", () => {
  it("returns no-diff message for empty grouped diff", () => {
    expect(formatGroupedDiffAsText(emptyGrouped)).toBe("No differences found.");
  });

  it("includes group labels", () => {
    const output = formatGroupedDiffAsText(sampleGrouped);
    expect(output).toContain("[Dependencies]");
    expect(output).toContain("[Dev Dependencies]");
  });

  it("uses + prefix for added entries", () => {
    const output = formatGroupedDiffAsText(sampleGrouped);
    expect(output).toContain("+ lodash");
  });

  it("uses - prefix for removed entries", () => {
    const output = formatGroupedDiffAsText(sampleGrouped);
    expect(output).toContain("- moment");
  });

  it("uses ~ prefix for changed entries", () => {
    const output = formatGroupedDiffAsText(sampleGrouped);
    expect(output).toContain("~ react");
  });
});

describe("formatGroupedDiffAsMarkdown", () => {
  it("returns italic no-diff message for empty grouped diff", () => {
    expect(formatGroupedDiffAsMarkdown(emptyGrouped)).toBe("_No differences found._");
  });

  it("includes markdown table headers", () => {
    const output = formatGroupedDiffAsMarkdown(sampleGrouped);
    expect(output).toContain("| Package | Before | After | Status |");
  });

  it("includes group headings", () => {
    const output = formatGroupedDiffAsMarkdown(sampleGrouped);
    expect(output).toContain("### Dependencies");
    expect(output).toContain("### Dev Dependencies");
  });
});

describe("formatGroupedDiff", () => {
  it("delegates to text formatter", () => {
    expect(formatGroupedDiff(emptyGrouped, "text")).toBe("No differences found.");
  });

  it("delegates to markdown formatter", () => {
    expect(formatGroupedDiff(emptyGrouped, "markdown")).toBe("_No differences found._");
  });
});
