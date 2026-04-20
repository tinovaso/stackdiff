import { buildGraph, renderGraphAsTree, GraphNode } from './dependencyGraph';
import { DiffEntry } from './diffEngine';

const sampleEntries: DiffEntry[] = [
  { name: 'react', prevVersion: '17.0.0', nextVersion: '18.0.0', status: 'changed' },
  { name: 'lodash', prevVersion: undefined, nextVersion: '4.17.21', status: 'added' },
  { name: 'axios', prevVersion: '1.0.0', nextVersion: undefined, status: 'removed' },
  { name: 'typescript', prevVersion: '5.0.0', nextVersion: '5.0.0', status: 'unchanged' },
];

describe('buildGraph', () => {
  it('excludes unchanged entries by default', () => {
    const nodes = buildGraph(sampleEntries);
    expect(nodes.find((n) => n.name === 'typescript')).toBeUndefined();
    expect(nodes).toHaveLength(3);
  });

  it('includes unchanged entries when showUnchanged is true', () => {
    const nodes = buildGraph(sampleEntries, { showUnchanged: true });
    expect(nodes).toHaveLength(4);
  });

  it('maps status correctly', () => {
    const nodes = buildGraph(sampleEntries);
    const react = nodes.find((n) => n.name === 'react');
    expect(react?.status).toBe('changed');
    expect(react?.version).toBe('18.0.0');
  });

  it('uses prevVersion for removed entries', () => {
    const nodes = buildGraph(sampleEntries);
    const axios = nodes.find((n) => n.name === 'axios');
    expect(axios?.version).toBe('1.0.0');
  });

  it('respects maxDepth option', () => {
    const deepEntries: DiffEntry[] = [
      { name: 'a/b/c', prevVersion: '1.0.0', nextVersion: '2.0.0', status: 'changed' },
      { name: 'simple', prevVersion: '1.0.0', nextVersion: '2.0.0', status: 'changed' },
    ];
    const nodes = buildGraph(deepEntries, { maxDepth: 0 });
    expect(nodes).toHaveLength(1);
    expect(nodes[0].name).toBe('simple');
  });
});

describe('renderGraphAsTree', () => {
  it('renders nodes with correct prefix symbols', () => {
    const nodes: GraphNode[] = [
      { name: 'react', version: '18.0.0', status: 'changed', depth: 0, children: [] },
      { name: 'lodash', version: '4.17.21', status: 'added', depth: 0, children: [] },
    ];
    const lines = renderGraphAsTree(nodes);
    expect(lines[0]).toContain('[~]');
    expect(lines[0]).toContain('react@18.0.0');
    expect(lines[1]).toContain('[+]');
    expect(lines[1]).toContain('lodash@4.17.21');
  });

  it('uses └── for last node and ├── for others', () => {
    const nodes: GraphNode[] = [
      { name: 'a', version: '1.0.0', status: 'added', depth: 0, children: [] },
      { name: 'b', version: '2.0.0', status: 'removed', depth: 0, children: [] },
    ];
    const lines = renderGraphAsTree(nodes);
    expect(lines[0]).toContain('├──');
    expect(lines[1]).toContain('└──');
  });

  it('returns empty array for empty input', () => {
    expect(renderGraphAsTree([])).toEqual([]);
  });
});
