/**
 * Help text and validation for namespace filter CLI options.
 */

export const namespaceFilterHelp = `
Namespace Filter Options:
  --namespace, --ns <scopes>          Comma-separated list of npm scopes to include.
                                      e.g. --namespace @babel,@types
  --exclude-namespace, --ens <scopes> Comma-separated list of npm scopes to exclude.
                                      e.g. --exclude-namespace @internal

Examples:
  stackdiff a.json b.json --namespace @babel
  stackdiff a.json b.json --exclude-namespace @internal,@company
`.trim();

export function validateNamespaceOptions(
  namespaces: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const ns of namespaces) {
    if (!ns.startsWith('@')) {
      errors.push(
        `Invalid namespace "${ns}": npm scopes must start with "@" (e.g. "@babel").`
      );
    } else if (ns.includes('/')) {
      errors.push(
        `Invalid namespace "${ns}": provide only the scope, not a full package name (e.g. "@babel" not "@babel/core").`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}
