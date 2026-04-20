export type ChangelogFormat = 'json' | 'markdown';

export interface ChangelogExportOptions {
  format: ChangelogFormat;
  outputPath?: string;
}

export const changelogExportHelp = `
Changelog Export Options:
  --changelog               Enable changelog export
  --changelog-format        Output format: json | markdown (default: markdown)
  --changelog-output        File path to write changelog (default: stdout)
`.trim();

export function validateChangelogFormat(format: string): format is ChangelogFormat {
  return format === 'json' || format === 'markdown';
}

export function parseChangelogExportOptions(
  args: string[]
): ChangelogExportOptions | null {
  const enableIndex = args.indexOf('--changelog');
  if (enableIndex === -1) {
    return null;
  }

  let format: ChangelogFormat = 'markdown';
  let outputPath: string | undefined;

  const formatIndex = args.indexOf('--changelog-format');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    const raw = args[formatIndex + 1];
    if (validateChangelogFormat(raw)) {
      format = raw;
    } else {
      throw new Error(
        `Invalid changelog format: "${raw}". Must be one of: json, markdown`
      );
    }
  }

  const outputIndex = args.indexOf('--changelog-output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputPath = args[outputIndex + 1];
  }

  return { format, outputPath };
}
