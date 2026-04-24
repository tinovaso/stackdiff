export interface AliasOptions {
  format: 'text' | 'markdown';
  onlyAliased: boolean;
}

export const aliasOptionsHelp = `
Alias Detection Options:
  --alias-format <text|markdown>   Output format for alias report (default: text)
  --only-aliased                   Only show aliased packages in output
`.trim();

export function parseAliasOptions(args: string[]): AliasOptions {
  const options: AliasOptions = {
    format: 'text',
    onlyAliased: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--alias-format') {
      const val = args[i + 1];
      if (val === 'markdown' || val === 'text') {
        options.format = val;
        i++;
      } else {
        throw new Error(`Invalid --alias-format value: '${val}'. Expected 'text' or 'markdown'.`);
      }
    } else if (arg === '--only-aliased') {
      options.onlyAliased = true;
    }
  }

  return options;
}
