import * as fs from 'fs';
import * as path from 'path';
import { parsePackageJson, flattenDependencies } from './packageParser';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

const samplePackage = {
  name: 'my-app',
  version: '1.0.0',
  dependencies: { react: '^18.0.0', lodash: '^4.17.21' },
  devDependencies: { jest: '^29.0.0' },
  peerDependencies: { typescript: '>=4.0.0' },
};

beforeEach(() => {
  mockFs.existsSync = jest.fn().mockReturnValue(true);
  mockFs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(samplePackage));
});

describe('parsePackageJson', () => {
  it('parses dependencies correctly', () => {
    const result = parsePackageJson('package.json');
    expect(result.dependencies).toEqual(samplePackage.dependencies);
    expect(result.devDependencies).toEqual(samplePackage.devDependencies);
    expect(result.peerDependencies).toEqual(samplePackage.peerDependencies);
  });

  it('throws if file does not exist', () => {
    mockFs.existsSync = jest.fn().mockReturnValue(false);
    expect(() => parsePackageJson('missing.json')).toThrow('File not found');
  });

  it('throws on invalid JSON', () => {
    mockFs.readFileSync = jest.fn().mockReturnValue('not json');
    expect(() => parsePackageJson('bad.json')).toThrow('Invalid JSON');
  });

  it('handles missing dependency fields gracefully', () => {
    mockFs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({ name: 'empty' }));
    const result = parsePackageJson('empty.json');
    expect(result.dependencies).toEqual({});
    expect(result.devDependencies).toEqual({});
  });
});

describe('flattenDependencies', () => {
  const depMap = {
    dependencies: { react: '^18.0.0' },
    devDependencies: { jest: '^29.0.0' },
    peerDependencies: { typescript: '>=4.0.0' },
  };

  it('includes all by default', () => {
    const flat = flattenDependencies(depMap);
    expect(Object.keys(flat)).toHaveLength(3);
  });

  it('excludes dev dependencies when flag is false', () => {
    const flat = flattenDependencies(depMap, false, false);
    expect(flat).toEqual({ react: '^18.0.0' });
  });
});
