/**
 * depthFilter.ts
 * Filter dependency diff results by dependency tree depth.
 */

import { DiffEntry } from './diffEngine';

export interface DepthFilterOptions {
  maxDepth?: number;
  minDepth?: number;
}

/**
 * Returns the depth of a package name based on its path notation.
 * e.g. "react" = depth 1, "react>prop-types" = depth 2
 */
export function getPackageDepth(name: string): number {
  if (!name || name.trim() === '') return 0;
  return name.split('>').length;
}

export function parseDepthFilterOptions(args: string[]): DepthFilterOptions {
  const opts: DepthFilterOptions = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--max-depth' && args[i + 1]) {
      const val = parseInt(args[i + 1], 10);
      if (!isNaN(val) && val >= 0) opts.maxDepth = val;
      i++;
    } else if (args[i] === '--min-depth' && args[i + 1]) {
      const val = parseInt(args[i + 1], 10);
      if (!isNaN(val) && val >= 0) opts.minDepth = val;
      i++;
    }
  }

  return opts;
}

export function filterByDepth(
  entries: DiffEntry[],
  opts: DepthFilterOptions
): DiffEntry[] {
  return entries.filter((entry) => {
    const depth = getPackageDepth(entry.name);
    if (opts.minDepth !== undefined && depth < opts.minDepth) return false;
    if (opts.maxDepth !== undefined && depth > opts.maxDepth) return false;
    return true;
  });
}
