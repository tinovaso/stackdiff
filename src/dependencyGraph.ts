import { DiffEntry } from './diffEngine';

export interface GraphNode {
  name: string;
  version: string;
  status: 'added' | 'removed' | 'changed' | 'unchanged';
  depth: number;
  children: GraphNode[];
}

export interface GraphOptions {
  maxDepth?: number;
  showUnchanged?: boolean;
}

export function buildGraph(
  entries: DiffEntry[],
  options: GraphOptions = {}
): GraphNode[] {
  const { maxDepth = Infinity, showUnchanged = false } = options;

  const filtered = showUnchanged
    ? entries
    : entries.filter((e) => e.status !== 'unchanged');

  return filtered
    .filter((e) => {
      const depth = e.name.split('/').length - 1;
      return depth <= maxDepth;
    })
    .map((e) => ({
      name: e.name,
      version: e.nextVersion ?? e.prevVersion ?? '',
      status: e.status,
      depth: e.name.split('/').length - 1,
      children: [],
    }));
}

export function renderGraphAsTree(nodes: GraphNode[]): string[] {
  const lines: string[] = [];

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const prefix = node.depth === 0 ? '' : '  '.repeat(node.depth);
    const connector = isLast ? '└── ' : '├── ';
    const statusSymbol =
      node.status === 'added'
        ? '+'
        : node.status === 'removed'
        ? '-'
        : node.status === 'changed'
        ? '~'
        : ' ';

    lines.push(`${prefix}${connector}[${statusSymbol}] ${node.name}@${node.version}`);

    if (node.children.length > 0) {
      lines.push(...renderGraphAsTree(node.children));
    }
  });

  return lines;
}
