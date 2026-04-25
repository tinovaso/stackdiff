import { execSync } from "child_process";

export interface RegistryInfo {
  name: string;
  version: string;
  registry: string;
  resolved: boolean;
}

export interface RegistryResolverOptions {
  registry?: string;
  timeout?: number;
}

const DEFAULT_REGISTRY = "https://registry.npmjs.org";
const DEFAULT_TIMEOUT = 5000;

export function getConfiguredRegistry(): string {
  try {
    const result = execSync("npm config get registry", { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    return result.trim() || DEFAULT_REGISTRY;
  } catch {
    return DEFAULT_REGISTRY;
  }
}

export function resolvePackageRegistry(
  name: string,
  version: string,
  options: RegistryResolverOptions = {}
): RegistryInfo {
  const registry = options.registry ?? getConfiguredRegistry();
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  try {
    const cmd = `npm view ${name}@${version} _resolved --registry=${registry} 2>/dev/null`;
    const output = execSync(cmd, { encoding: "utf8", timeout, stdio: ["pipe", "pipe", "ignore"] }).trim();
    const resolved = output.length > 0;
    return { name, version, registry: resolved ? output : registry, resolved };
  } catch {
    return { name, version, registry, resolved: false };
  }
}

export function resolveMultiplePackages(
  packages: Array<{ name: string; version: string }>,
  options: RegistryResolverOptions = {}
): RegistryInfo[] {
  return packages.map(({ name, version }) =>
    resolvePackageRegistry(name, version, options)
  );
}

export function buildRegistryReport(infos: RegistryInfo[]): {
  resolved: RegistryInfo[];
  unresolved: RegistryInfo[];
  total: number;
} {
  const resolved = infos.filter((i) => i.resolved);
  const unresolved = infos.filter((i) => !i.resolved);
  return { resolved, unresolved, total: infos.length };
}
