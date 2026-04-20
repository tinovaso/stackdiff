import { SemverGroupOptions, SemverGroupType } from './semverGroup';

const VALID_GROUPS: SemverGroupType[] = ['major', 'minor', 'patch', 'prerelease', 'unknown'];

export const semverGroupHelp = `
Semver Group Options:
  --group-by <types>    Comma-separated list of change types to group by.
                        Valid values: major, minor, patch, prerelease, unknown
                        Default: major,minor,patch
`.trim();

export function parseSemverGroupOptions(args: string[]): SemverGroupOptions {
  const defaultGroups: SemverGroupType[] = ['major', 'minor', 'patch'];
  const idx = args.indexOf('--group-by');
  if (idx === -1) return { groupBy: defaultGroups };

  const raw = args[idx + 1];
  if (!raw) throw new Error('--group-by requires a value');

  const groupBy = raw.split(',').map((s) => s.trim()) as SemverGroupType[];
  const invalid = groupBy.filter((g) => !VALID_GROUPS.includes(g));
  if (invalid.length > 0) {
    throw new Error(`Invalid group-by values: ${invalid.join(', ')}. Valid: ${VALID_GROUPS.join(', ')}`);
  }

  return { groupBy };
}
