import {
  getConfiguredRegistry,
  resolvePackageRegistry,
  resolveMultiplePackages,
  buildRegistryReport,
  RegistryInfo,
} from "./registryResolver";

jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

import { execSync } from "child_process";
const mockExec = execSync as jest.Mock;

describe("getConfiguredRegistry", () => {
  it("returns trimmed registry URL from npm config", () => {
    mockExec.mockReturnValueOnce("https://registry.npmjs.org\n");
    expect(getConfiguredRegistry()).toBe("https://registry.npmjs.org");
  });

  it("returns default registry on exec failure", () => {
    mockExec.mockImplementationOnce(() => { throw new Error("fail"); });
    expect(getConfiguredRegistry()).toBe("https://registry.npmjs.org");
  });

  it("returns default registry when output is empty", () => {
    mockExec.mockReturnValueOnce("");
    expect(getConfiguredRegistry()).toBe("https://registry.npmjs.org");
  });
});

describe("resolvePackageRegistry", () => {
  it("returns resolved info when npm view succeeds", () => {
    mockExec
      .mockReturnValueOnce("https://registry.npmjs.org\n") // getConfiguredRegistry
      .mockReturnValueOnce("https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz\n");
    const result = resolvePackageRegistry("lodash", "4.17.21");
    expect(result.name).toBe("lodash");
    expect(result.version).toBe("4.17.21");
    expect(result.resolved).toBe(true);
  });

  it("returns unresolved info on exec failure", () => {
    mockExec
      .mockReturnValueOnce("https://registry.npmjs.org\n")
      .mockImplementationOnce(() => { throw new Error("not found"); });
    const result = resolvePackageRegistry("unknown-pkg", "1.0.0");
    expect(result.resolved).toBe(false);
    expect(result.name).toBe("unknown-pkg");
  });

  it("uses provided registry option", () => {
    mockExec.mockReturnValueOnce("https://my.registry.com/pkg.tgz\n");
    const result = resolvePackageRegistry("mypkg", "2.0.0", {
      registry: "https://my.registry.com",
    });
    expect(result.registry).toBe("https://my.registry.com/pkg.tgz");
  });
});

describe("resolveMultiplePackages", () => {
  it("resolves an array of packages", () => {
    mockExec
      .mockReturnValue("https://registry.npmjs.org\n")
      .mockReturnValueOnce("https://registry.npmjs.org\n")
      .mockReturnValueOnce("https://registry.npmjs.org/a.tgz\n")
      .mockReturnValueOnce("https://registry.npmjs.org\n")
      .mockReturnValueOnce("https://registry.npmjs.org/b.tgz\n");
    const results = resolveMultiplePackages([
      { name: "a", version: "1.0.0" },
      { name: "b", version: "2.0.0" },
    ]);
    expect(results).toHaveLength(2);
  });
});

describe("buildRegistryReport", () => {
  const infos: RegistryInfo[] = [
    { name: "a", version: "1.0.0", registry: "https://r.com/a.tgz", resolved: true },
    { name: "b", version: "2.0.0", registry: "https://registry.npmjs.org", resolved: false },
    { name: "c", version: "3.0.0", registry: "https://r.com/c.tgz", resolved: true },
  ];

  it("separates resolved and unresolved", () => {
    const report = buildRegistryReport(infos);
    expect(report.resolved).toHaveLength(2);
    expect(report.unresolved).toHaveLength(1);
    expect(report.total).toBe(3);
  });

  it("returns empty arrays for empty input", () => {
    const report = buildRegistryReport([]);
    expect(report.total).toBe(0);
    expect(report.resolved).toHaveLength(0);
    expect(report.unresolved).toHaveLength(0);
  });
});
