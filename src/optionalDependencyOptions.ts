export interface OptionalDependencyOptions {
  format: 'text' | 'markdown';
  includeUnchanged: boolean;
  sideFilter: 'all' | 'a' | 'b';
}

const defaults: OptionalDependencyOptions = {
  format: 'text',
  includeUnchanged: false,
  sideFilter: 'all',
};

export function parseOptionalDependencyOptions(
  args: Record<string, string | boolean | undefined>
): OptionalDependencyOptions {
  const format = (args['optional-format'] as string) ?? defaults.format;
  if (format !== 'text' && format !== 'markdown') {
    throw new Error(`Invalid --optional-format value: "${format}". Must be "text" or "markdown".`);
  }

  const sideFilter = (args['optional-side'] as string) ?? defaults.sideFilter;
  if (sideFilter !== 'all' && sideFilter !== 'a' && sideFilter !== 'b') {
    throw new Error(`Invalid --optional-side value: "${sideFilter}". Must be "all", "a", or "b".`);
  }

  return {
    format: format as 'text' | 'markdown',
    includeUnchanged: Boolean(args['optional-include-unchanged'] ?? defaults.includeUnchanged),
    sideFilter: sideFilter as 'all' | 'a' | 'b',
  };
}

export const optionalDependencyHelp = `
  --optional-format <text|markdown>   Output format for optional dependency report (default: text)
  --optional-side <all|a|b>           Filter entries by which side they appear on (default: all)
  --optional-include-unchanged        Include packages that are optional on both sides with no version change
`.trim();
