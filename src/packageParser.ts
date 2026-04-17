import * as fs from 'fs';
import * as path from 'path';

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface DependencyMap {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

export function parsePackageJson(filePath: string): DependencyMap {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf-8');
  let parsed: PackageJson;

  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in file: ${absolutePath}`);
  }

  return {
    dependencies: parsed.dependencies ?? {},
    devDependencies: parsed.devDependencies ?? {},
    peerDependencies: parsed.peerDependencies ?? {},
  };
}

export function flattenDependencies(
  depMap: DependencyMap,
  includeDev = true,
  includePeer = true
): Record<string, string> {
  return {
    ...depMap.dependencies,
    ...(includeDev ? depMap.devDependencies : {}),
    ...(includePeer ? depMap.peerDependencies : {}),
  };
}
