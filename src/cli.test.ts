import * as fs from 'fs';
import * as path from 'path';
import { run } from './cli';

const pkgA = JSON.stringify({
  name: 'app-a',
  dependencies: { react: '^17.0.0', lodash: '^4.17.21' },
  devDependencies: { jest: '^27.0.0' }
});

const pkgB = JSON.stringify({
  name: 'app-b',
  dependencies: { react: '^18.0.0', axios: '^1.0.0' },
  devDependencies: { jest: '^29.0.0' }
});

const tmpA = path.join(__dirname, '__tmp_pkgA.json');
const tmpB = path.join(__dirname, '__tmp_pkgB.json');

beforeAll(() => {
  fs.writeFileSync(tmpA, pkgA);
  fs.writeFileSync(tmpB, pkgB);
});

afterAll(() => {
  fs.unlinkSync(tmpA);
  fs.unlinkSync(tmpB);
});

describe('cli run()', () => {
  it('prints a report without throwing', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    expect(() => run(['node', 'stackdiff', tmpA, tmpB])).not.toThrow();
    spy.mockRestore();
  });

  it('outputs valid JSON when --json flag is set', () => {
    const output: string[] = [];
    const spy = jest.spyOn(console, 'log').mockImplementation((msg) => output.push(msg));
    run(['node', 'stackdiff', tmpA, tmpB, '--json']);
    spy.mockRestore();
    const parsed = JSON.parse(output.join('\n'));
    expect(parsed).toHaveProperty('added');
    expect(parsed).toHaveProperty('removed');
    expect(parsed).toHaveProperty('changed');
  });

  it('excludes devDependencies with --no-dev', () => {
    const output: string[] = [];
    const spy = jest.spyOn(console, 'log').mockImplementation((msg) => output.push(msg));
    run(['node', 'stackdiff', tmpA, tmpB, '--json', '--no-dev']);
    spy.mockRestore();
    const parsed = JSON.parse(output.join('\n'));
    const allKeys = [
      ...Object.keys(parsed.added),
      ...Object.keys(parsed.removed),
      ...Object.keys(parsed.changed)
    ];
    expect(allKeys).not.toContain('jest');
  });

  it('exits with error for missing file', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => { throw new Error(`exit:${code}`); });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => run(['node', 'stackdiff', 'nonexistent.json', tmpB])).toThrow('exit:1');
    mockExit.mockRestore();
  });
});
