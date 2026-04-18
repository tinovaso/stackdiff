import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { parseOutputOptions, writeOutput } from './outputWriter';

describe('parseOutputOptions', () => {
  it('returns stdout when no --output flag', () => {
    expect(parseOutputOptions([])).toEqual({ target: 'stdout' });
  });

  it('returns file target with path', () => {
    expect(parseOutputOptions(['--output', 'report.txt'])).toEqual({
      target: 'file',
      filePath: 'report.txt',
      overwrite: false,
    });
  });

  it('sets overwrite when flag present', () => {
    const result = parseOutputOptions(['--output', 'out.md', '--overwrite']);
    expect(result.overwrite).toBe(true);
  });

  it('returns stdout when --output has no value', () => {
    expect(parseOutputOptions(['--output'])).toEqual({ target: 'stdout' });
  });
});

describe('writeOutput', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stackdiff-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('writes content to a file', () => {
    const filePath = path.join(tmpDir, 'output.txt');
    writeOutput('hello', { target: 'file', filePath, overwrite: false });
    expect(fs.readFileSync(filePath, 'utf-8')).toBe('hello\n');
  });

  it('throws if file exists and overwrite is false', () => {
    const filePath = path.join(tmpDir, 'output.txt');
    fs.writeFileSync(filePath, 'existing');
    expect(() =>
      writeOutput('new', { target: 'file', filePath, overwrite: false })
    ).toThrow(/already exists/);
  });

  it('overwrites file when overwrite is true', () => {
    const filePath = path.join(tmpDir, 'output.txt');
    fs.writeFileSync(filePath, 'old');
    writeOutput('new', { target: 'file', filePath, overwrite: true });
    expect(fs.readFileSync(filePath, 'utf-8')).toBe('new\n');
  });

  it('creates nested directories as needed', () => {
    const filePath = path.join(tmpDir, 'nested', 'dir', 'output.txt');
    writeOutput('data', { target: 'file', filePath, overwrite: false });
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
