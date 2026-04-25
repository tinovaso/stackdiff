export interface PrivatePackageOptions {
  enabled: boolean;
  format: 'text' | 'markdown';
  includeAdded: boolean;
  includeRemoved: boolean;
}

export const privatePackageHelp = `
  --private-packages         Detect private/local packages in the diff
  --private-format <fmt>     Output format: text (default) or markdown
  --private-added-only       Only report newly added private packages
  --private-removed-only     Only report removed private packages
`.trim();

export function parsePrivatePackageOptions(
  args: string[]
): PrivatePackageOptions {
  const enabled = args.includes('--private-packages');
  const fmtIdx = args.indexOf('--private-format');
  const rawFmt = fmtIdx !== -1 ? args[fmtIdx + 1] : 'text';
  const format: 'text' | 'markdown' =
    rawFmt === 'markdown' ? 'markdown' : 'text';

  const addedOnly = args.includes('--private-added-only');
  const removedOnly = args.includes('--private-removed-only');

  return {
    enabled,
    format,
    includeAdded: !removedOnly,
    includeRemoved: !addedOnly,
  };
}
