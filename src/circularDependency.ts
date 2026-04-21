export interface CircularPath {
  cycle: string[];
  length: number;
}

export interface CircularDependencyReport {
  hasCycles: boolean;
  cycles: CircularPath[];
  totalCycles: number;
}

type DependencyMap = Record<string, string[]>;

function detectCycles(
  node: string,
  graph: DependencyMap,
  visited: Set<string>,
  stack: string[],
  cycles: CircularPath[]
): void {
  visited.add(node);
  stack.push(node);

  const neighbors = graph[node] ?? [];
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      detectCycles(neighbor, graph, visited, stack, cycles);
    } else if (stack.includes(neighbor)) {
      const cycleStart = stack.indexOf(neighbor);
      const cycle = [...stack.slice(cycleStart), neighbor];
      cycles.push({ cycle, length: cycle.length - 1 });
    }
  }

  stack.pop();
}

export function findCircularDependencies(graph: DependencyMap): CircularPath[] {
  const visited = new Set<string>();
  const cycles: CircularPath[] = [];

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      detectCycles(node, graph, visited, [], cycles);
    }
  }

  return cycles;
}

export function buildCircularDependencyReport(
  graph: DependencyMap
): CircularDependencyReport {
  const cycles = findCircularDependencies(graph);
  return {
    hasCycles: cycles.length > 0,
    cycles,
    totalCycles: cycles.length,
  };
}
