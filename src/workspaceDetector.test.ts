import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  detectWorkspacePackages,
  buildWorkspaceReport,
} from "./workspaceDetector";

function createTmpWorkspace(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stackdiff-ws-"));
  const rootPkg = {
    name: "my-monorepo",
    version: "1.0.0",
    workspaces: ["packages/*"],
  };
  fs.writeFileSync(path.join(tmp, "package.json"), JSON.stringify(rootPkg));

  const pkgsDir = path.join(tmp, "packages");
  fs.mkdirSync(pkgsDir);

  const pkgA = { name: "@mono/a", version: "1.0.0", dependencies: { lodash: "^4.0.0", "@mono/b": "*" } };
  const pkgB = { name: "@mono/b", version: "2.0.0", devDependencies: { jest: "^29.0.0" } };

  fs.mkdirSync(path.join(pkgsDir, "a"));
  fs.writeFileSync(path.join(pkgsDir, "a", "package.json"), JSON.stringify(pkgA));

  fs.mkdirSync(path.join(pkgsDir, "b"));
  fs.writeFileSync(path.join(pkgsDir, "b", "package.json"), JSON.stringify(pkgB));

  return tmp;
}

describe("detectWorkspacePackages", () => {
  it("returns empty array when no package.json found", () => {
    expect(detectWorkspacePackages("/nonexistent/path")).toEqual([]);
  });

  it("returns empty array when no workspaces field", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stackdiff-"));
    fs.writeFileSync(path.join(tmp, "package.json"), JSON.stringify({ name: "solo" }));
    expect(detectWorkspacePackages(tmp)).toEqual([]);
  });

  it("detects packages in workspace globs", () => {
    const tmp = createTmpWorkspace();
    const pkgs = detectWorkspacePackages(tmp);
    expect(pkgs).toHaveLength(2);
    const names = pkgs.map((p) => p.name);
    expect(names).toContain("@mono/a");
    expect(names).toContain("@mono/b");
  });

  it("captures dependencies and devDependencies", () => {
    const tmp = createTmpWorkspace();
    const pkgs = detectWorkspacePackages(tmp);
    const a = pkgs.find((p) => p.name === "@mono/a")!;
    expect(a.dependencies["lodash"]).toBe("^4.0.0");
  });
});

describe("buildWorkspaceReport", () => {
  it("identifies cross-links between workspace packages", () => {
    const tmp = createTmpWorkspace();
    const report = buildWorkspaceReport(tmp);
    expect(report.crossLinks).toHaveLength(1);
    expect(report.crossLinks[0]).toEqual({ from: "@mono/a", to: "@mono/b", version: "*" });
  });

  it("sets root correctly", () => {
    const tmp = createTmpWorkspace();
    const report = buildWorkspaceReport(tmp);
    expect(report.root).toBe(tmp);
  });
});
