import { GraphOptions } from './dependencyGraph';

export const dependencyGraphHelp = `
Graph Options:
  --graph              Render output as a dependency tree graph
  --graph-depth=N      Maximum depth of nodes to display (default: unlimited)
  --show-unchanged     Include unchanged packages in the graph
`.trim();

export function parseDependencyGraphOptions(
  args: string[]
): { enabled: boolean; options: GraphOptions } {
  const enabled = args.includes('--graph');

  const depthArg = args.find((a) => a.startsWith('--graph-depth='));
  const maxDepth = depthArg
    ? parseInt(depthArg.split('=')[1], 10)
    : undefined;

  if (depthArg && (isNaN(maxDepth!) || maxDepth! < 0)) {
    throw new Error(
      `Invalid --graph-depth value: "${depthArg.split('=')[1]}". Must be a non-negative integer.`
    );
  }

  const showUnchanged = args.includes('--show-unchanged');

  return {
    enabled,
    options: {
      ...(maxDepth !== undefined ? { maxDepth } : {}),
      showUnchanged,
    },
  };
}

export function validateGraphOptions(options: GraphOptions): string[] {
  const errors: string[] = [];
  if (
    options.maxDepth !== undefined &&
    (!Number.isInteger(options.maxDepth) || options.maxDepth < 0)
  ) {
    errors.push('maxDepth must be a non-negative integer');
  }
  return errors;
}
