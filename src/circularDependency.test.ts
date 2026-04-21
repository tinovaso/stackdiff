import {
  findCircularDependencies,
  buildCircularDependencyReport,
} from "./circularDependency";
import {
  formatCircularReportAsText,
  formatCircularReportAsMarkdown,
} from "./circularDependencyFormatter";

describe("findCircularDependencies", () => {
  it("returns empty array for acyclic graph", () => {
    const graph = { a: ["b"], b: ["c"], c: [] };
    expect(findCircularDependencies(graph)).toHaveLength(0);
  });

  it("detects a simple cycle", () => {
    const graph = { a: ["b"], b: ["a"] };
    const cycles = findCircularDependencies(graph);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0].cycle).toContain("a");
    expect(cycles[0].cycle).toContain("b");
  });

  it("detects a longer cycle", () => {
    const graph = { a: ["b"], b: ["c"], c: ["a"] };
    const cycles = findCircularDependencies(graph);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0].length).toBe(3);
  });

  it("handles empty graph", () => {
    expect(findCircularDependencies({})).toHaveLength(0);
  });

  it("handles node with no edges", () => {
    const graph = { a: [], b: [], c: [] };
    expect(findCircularDependencies(graph)).toHaveLength(0);
  });
});

describe("buildCircularDependencyReport", () => {
  it("reports no cycles for acyclic graph", () => {
    const report = buildCircularDependencyReport({ a: ["b"], b: [] });
    expect(report.hasCycles).toBe(false);
    expect(report.totalCycles).toBe(0);
  });

  it("reports cycles correctly", () => {
    const report = buildCircularDependencyReport({ a: ["b"], b: ["a"] });
    expect(report.hasCycles).toBe(true);
    expect(report.totalCycles).toBeGreaterThan(0);
  });
});

describe("formatCircularReportAsText", () => {
  it("formats no-cycle report", () => {
    const report = buildCircularDependencyReport({ a: ["b"], b: [] });
    expect(formatCircularReportAsText(report)).toContain("No circular");
  });

  it("formats cycle report with count", () => {
    const report = buildCircularDependencyReport({ a: ["b"], b: ["a"] });
    const text = formatCircularReportAsText(report);
    expect(text).toMatch(/cycle/);
    expect(text).toContain("→");
  });
});

describe("formatCircularReportAsMarkdown", () => {
  it("includes markdown heading", () => {
    const report = buildCircularDependencyReport({ a: [] });
    expect(formatCircularReportAsMarkdown(report)).toContain("## Circular");
  });

  it("uses backtick formatting for cycles", () => {
    const report = buildCircularDependencyReport({ a: ["b"], b: ["a"] });
    expect(formatCircularReportAsMarkdown(report)).toContain("`");
  });
});
