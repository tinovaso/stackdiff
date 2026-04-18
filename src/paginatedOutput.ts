import * as readline from 'readline';

export interface PaginationOptions {
  pageSize?: number;
  interactive?: boolean;
}

const DEFAULT_PAGE_SIZE = 20;

export function paginateLines(
  lines: string[],
  options: PaginationOptions = {}
): void {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const interactive = options.interactive ?? process.stdout.isTTY;

  if (!interactive || lines.length <= pageSize) {
    lines.forEach((line) => console.log(line));
    return;
  }

  let offset = 0;

  const printPage = () => {
    const page = lines.slice(offset, offset + pageSize);
    page.forEach((line) => console.log(line));
    offset += pageSize;
  };

  printPage();

  if (offset >= lines.length) return;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdin.setRawMode?.(true);

  const prompt = () => {
    if (offset >= lines.length) {
      process.stdout.write('\n(END)\n');
      rl.close();
      process.stdin.setRawMode?.(false);
      return;
    }
    process.stdout.write(`\n-- More (${offset}/${lines.length}) [ENTER to continue, q to quit] -- `);
  };

  prompt();

  rl.on('line', (input) => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed === 'q' || trimmed === 'quit') {
      rl.close();
      process.stdin.setRawMode?.(false);
      process.stdout.write('\n');
      return;
    }
    process.stdout.write('\n');
    printPage();
    prompt();
  });
}

export function splitIntoLines(text: string): string[] {
  return text.split('\n');
}
