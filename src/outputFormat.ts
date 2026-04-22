export type OutputFormat = 'text' | 'json' | 'markdown';

const VALID_FORMATS: OutputFormat[] = ['text', 'json', 'markdown'];

export function parseOutputFormat(args: string[]): OutputFormat {
  const idx = args.indexOf('--format');
  if (idx === -1 || idx + 1 >= args.length) {
    return 'text';
  }
  const value = args[idx + 1];
  if (value.startsWith('--')) {
    throw new Error(
      `Expected a format value after --format, but got another flag: "${value}"`
    );
  }
  if (!VALID_FORMATS.includes(value as OutputFormat)) {
    throw new Error(
      `Invalid format: "${value}". Valid options are: ${VALID_FORMATS.join(', ')}`
    );
  }
  return value as OutputFormat;
}

export function validateOutputFormat(format: string): format is OutputFormat {
  return VALID_FORMATS.includes(format as OutputFormat);
}

export function outputFormatHelp(): string {
  return `  --format <type>   Output format: ${VALID_FORMATS.join(' | ')} (default: text)`;
}
