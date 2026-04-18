import * as fs from 'fs';
import * as path from 'path';

export type OutputTarget = 'stdout' | 'file';

export interface OutputOptions {
  target: OutputTarget;
  filePath?: string;
  overwrite?: boolean;
}

export function parseOutputOptions(args: string[]): OutputOptions {
  const outIndex = args.indexOf('--output');
  if (outIndex === -1 || outIndex + 1 >= args.length) {
    return { target: 'stdout' };
  }
  const filePath = args[outIndex + 1];
  const overwrite = args.includes('--overwrite');
  return { target: 'file', filePath, overwrite };
}

export function writeOutput(content: string, options: OutputOptions): void {
  if (options.target === 'stdout' || !options.filePath) {
    process.stdout.write(content + '\n');
    return;
  }

  const resolved = path.resolve(options.filePath);

  if (fs.existsSync(resolved) && !options.overwrite) {
    throw new Error(
      `File already exists: ${resolved}. Use --overwrite to replace it.`
    );
  }

  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, content + '\n', 'utf-8');
}

export function outputWriterHelp(): string {
  return [
    '  --output <file>   Write output to a file instead of stdout',
    '  --overwrite       Overwrite the output file if it already exists',
  ].join('\n');
}
