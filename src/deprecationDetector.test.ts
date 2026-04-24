import { detectDeprecations, isDeprecated } from "./deprecationDetector";
import { FlatDependencyMap } from "./packageParser";

describe("isDeprecated", () => {
  it("returns a message for a known deprecated package", () => {
    const msg = isDeprecated("request", "2.88.2");
    expect(msg).toBeTruthy();
    expect(typeof msg).toBe("string");
  });

  it("returns null for a non-deprecated package", () => {
    const msg = isDeprecated("lodash", "4.17.21");
    expect(msg).toBeNull();
  });

  it("returns null for an unknown package", () => {
    expect(isDeprecated("some-random-pkg", "1.0.0")).toBeNull();
  });
});

describe("detectDeprecations", () => {
  it("returns empty report when no deprecated packages present", () => {
    const deps: FlatDependencyMap = { lodash: "4.17.21", axios: "1.4.0" };
    const report = detectDeprecations(deps);
    expect(report.total).toBe(0);
    expect(report.deprecated).toHaveLength(0);
    expect(report.checkedCount).toBe(2);
  });

  it("detects deprecated packages in the map", () => {
    const deps: FlatDependencyMap = {
      request: "2.88.2",
      lodash: "4.17.21",
      jade: "1.11.0",
    };
    const report = detectDeprecations(deps);
    expect(report.total).toBe(2);
    expect(report.checkedCount).toBe(3);
    const names = report.deprecated.map((e) => e.name);
    expect(names).toContain("request");
    expect(names).toContain("jade");
  });

  it("includes the deprecation message in each entry", () => {
    const deps: FlatDependencyMap = { "node-uuid": "1.4.8" };
    const report = detectDeprecations(deps);
    expect(report.deprecated[0].message).toMatch(/uuid/i);
  });

  it("records the correct version in each entry", () => {
    const deps: FlatDependencyMap = { request: "2.88.2" };
    const report = detectDeprecations(deps);
    expect(report.deprecated[0].version).toBe("2.88.2");
  });

  it("handles an empty dependency map", () => {
    const report = detectDeprecations({});
    expect(report.total).toBe(0);
    expect(report.checkedCount).toBe(0);
  });
});
