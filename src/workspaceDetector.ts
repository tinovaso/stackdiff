import * as fs from "fs";
import * as path from "path";

export interface WorkspacePackage {
  name: string;
  version: string;
  location: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface WorkspaceReport {
  root: string;
  packages: WorkspacePackage[];
  crossLinks: Array<{ from: string; to: string; version: string }>;
}

export function detectWorkspacePackages(rootDir: string): WorkspacePackage[] {
  const rootPkgPath = path.join(rootDir, "package.json");
  if (!fs.existsSync(rootPkgPath)) {
    return [];
  }

  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
  const workspaceGlobs: string[] = rootPkg.workspaces ?? [];

  if (workspaceGlobs.length === 0) {
    return [];
  }

  const packages: WorkspacePackage[] = [];

  for (const glob of workspaceGlobs) {
    const baseDir = glob.replace(/\/\*$/, "");
    const resolvedBase = path.join(rootDir, baseDir);
    if (!fs.existsSync(resolvedBase)) continue;

    const entries = fs.readdirSync(resolvedBase, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const pkgPath = path.join(resolvedBase, entry.name, "package.json");
      if (!fs.existsSync(pkgPath)) continue;

      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      packages.push({
        name: pkg.name ?? entry.name,
        version: pkg.version ?? "0.0.0",
        location: path.join(baseDir, entry.name),
        dependencies: pkg.dependencies ?? {},
        devDependencies: pkg.devDependencies ?? {},
      });
    }
  }

  return packages;
}

export function buildWorkspaceReport(rootDir: string): WorkspaceReport {
  const packages = detectWorkspacePackages(rootDir);
  const nameSet = new Set(packages.map((p) => p.name));
  const crossLinks: WorkspaceReport["crossLinks"] = [];

  for (const pkg of packages) {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [dep, version] of Object.entries(allDeps)) {
      if (nameSet.has(dep)) {
        crossLinks.push({ from: pkg.name, to: dep, version });
      }
    }
  }

  return { root: rootDir, packages, crossLinks };
}
