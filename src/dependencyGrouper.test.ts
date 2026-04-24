import { groupDiffByType, buildSourceHints, classifyEntry } from "./dependencyGrouper";
import { DiffEntry } from "./diffEngine";

const added: DiffEntry = { name: "lodash", status: "added", versionA: undefined, versionB: "4.17.21" };
const removed: DiffEntry = { name: "moment", status: "removed", versionA: "2.29.0", versionB: undefined };
const changed: DiffEntry = { name: "react", status: "changed", versionA: "17.0.0", versionB: "18.0.0" };
const devDep: DiffEntry = { name: "jest", status: "added", versionA: undefined, versionB: "29.0.0" };

const hints = {
  lodash: "dependencies" as const,
  moment: "dependencies" as const,
  react: "dependencies" as const,
  jest: "devDependencies" as const,
};

describe("classifyEntry", () => {
  it("returns the hint for a known package", () => {
    expect(classifyEntry(added, hints)).toBe("dependencies");
  });

  it("returns unknown for an unrecognised package", () => {
    const mystery: DiffEntry = { name: "mystery-pkg", status: "added", versionA: undefined, versionB: "1.0.0" };
    expect(classifyEntry(mystery, hints)).toBe("unknown");
  });
});

describe("groupDiffByType", () => {
  it("groups entries into correct buckets", () => {
    const result = groupDiffByType([added, removed, changed, devDep], hints);
    expect(result.totalEntries).toBe(4);
    const depGroup = result.groups.find((g) => g.key === "dependencies");
    expect(depGroup?.entries).toHaveLength(3);
    const devGroup = result.groups.find((g) => g.key === "devDependencies");
    expect(devGroup?.entries).toHaveLength(1);
  });

  it("returns empty groups array when no entries", () => {
    const result = groupDiffByType([], hints);
    expect(result.groups).toHaveLength(0);
    expect(result.totalEntries).toBe(0);
  });

  it("places unknown packages in the unknown group", () => {
    const mystery: DiffEntry = { name: "mystery-pkg", status: "added", versionA: undefined, versionB: "1.0.0" };
    const result = groupDiffByType([mystery], {});
    expect(result.groups[0].key).toBe("unknown");
  });
});

describe("buildSourceHints", () => {
  it("extracts hints from all sections", () => {
    const pkg = {
      dependencies: { react: "^18.0.0" },
      devDependencies: { jest: "^29.0.0" },
      peerDependencies: { "react-dom": "^18.0.0" },
      optionalDependencies: { fsevents: "^2.0.0" },
    };
    const hints = buildSourceHints(pkg);
    expect(hints["react"]).toBe("dependencies");
    expect(hints["jest"]).toBe("devDependencies");
    expect(hints["react-dom"]).toBe("peerDependencies");
    expect(hints["fsevents"]).toBe("optionalDependencies");
  });

  it("ignores non-object sections", () => {
    const pkg = { dependencies: null, name: "my-pkg" };
    expect(() => buildSourceHints(pkg)).not.toThrow();
  });
});
