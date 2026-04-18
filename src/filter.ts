export type FilterOptions = {
  include?: string[];
  exclude?: string[];
  onlyChanged?: boolean;
  devOnly?: boolean;
  prodOnly?: boolean;
};

export type DiffEntry = {
  name: string;
  from: string | null;
  to: string | null;
  status: 'added' | 'removed' | 'changed' | 'unchanged';
  dev?: boolean;
};

export function filterDiff(
  entries: DiffEntry[],
  options: FilterOptions
): DiffEntry[] {
  let result = [...entries];

  if (options.onlyChanged) {
    result = result.filter((e) => e.status !== 'unchanged');
  }

  if (options.devOnly) {
    result = result.filter((e) => e.dev === true);
  }

  if (options.prodOnly) {
    result = result.filter((e) => e.dev !== true);
  }

  if (options.include && options.include.length > 0) {
    const patterns = options.include.map((p) => new RegExp(p));
    result = result.filter((e) => patterns.some((re) => re.test(e.name)));
  }

  if (options.exclude && options.exclude.length > 0) {
    const patterns = options.exclude.map((p) => new RegExp(p));
    result = result.filter((e) => !patterns.some((re) => re.test(e.name)));
  }

  return result;
}
