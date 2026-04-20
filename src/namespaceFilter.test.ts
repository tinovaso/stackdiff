import {
  parseNamespaceFilterOptions,
  getPackageNamespace,
  filterByNamespace,
  NamespaceFilterOptions,
} from './namespaceFilter';
import { DiffResult } from './diffEngine';

const makeDiff = (name: string): DiffResult => ({
  name,
  oldVersion: '1.0.0',
  newVersion: '2.0.0',
  status: 'changed',
});

describe('getPackageNamespace', () => {
  it('returns the scope for scoped packages', () => {
    expect(getPackageNamespace('@babel/core')).toBe('@babel');
    expect(getPackageNamespace('@types/node')).toBe('@types');
  });

  it('returns null for unscoped packages', () => {
    expect(getPackageNamespace('lodash')).toBeNull();
    expect(getPackageNamespace('react')).toBeNull();
  });

  it('returns null for malformed scoped names', () => {
    expect(getPackageNamespace('@noslash')).toBeNull();
  });
});

describe('parseNamespaceFilterOptions', () => {
  it('parses --namespace as comma-separated list', () => {
    const opts = parseNamespaceFilterOptions({ namespace: '@babel,@types' });
    expect(opts.includeNamespaces).toEqual(['@babel', '@types']);
  });

  it('parses --exclude-namespace', () => {
    const opts = parseNamespaceFilterOptions({ 'exclude-namespace': '@internal' });
    expect(opts.excludeNamespaces).toEqual(['@internal']);
  });

  it('returns empty arrays when no options given', () => {
    const opts = parseNamespaceFilterOptions({});
    expect(opts.includeNamespaces).toEqual([]);
    expect(opts.excludeNamespaces).toEqual([]);
  });
});

describe('filterByNamespace', () => {
  const diff: DiffResult[] = [
    makeDiff('@babel/core'),
    makeDiff('@babel/preset-env'),
    makeDiff('@types/node'),
    makeDiff('lodash'),
    makeDiff('react'),
  ];

  it('returns all entries when no filters set', () => {
    const opts: NamespaceFilterOptions = { includeNamespaces: [], excludeNamespaces: [] };
    expect(filterByNamespace(diff, opts)).toHaveLength(5);
  });

  it('includes only matching namespaces', () => {
    const opts: NamespaceFilterOptions = { includeNamespaces: ['@babel'], excludeNamespaces: [] };
    const result = filterByNamespace(diff, opts);
    expect(result.map((d) => d.name)).toEqual(['@babel/core', '@babel/preset-env']);
  });

  it('excludes matching namespaces', () => {
    const opts: NamespaceFilterOptions = { includeNamespaces: [], excludeNamespaces: ['@types'] };
    const result = filterByNamespace(diff, opts);
    expect(result.map((d) => d.name)).not.toContain('@types/node');
    expect(result).toHaveLength(4);
  });

  it('exclude takes priority over include for same namespace', () => {
    const opts: NamespaceFilterOptions = {
      includeNamespaces: ['@babel'],
      excludeNamespaces: ['@babel'],
    };
    const result = filterByNamespace(diff, opts);
    expect(result).toHaveLength(0);
  });
});
