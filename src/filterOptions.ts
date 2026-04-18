import { FilterOptions } from './filter';

export type RawArgs = {
  include?: string;
  exclude?: string;
  onlyChanged?: boolean;
  devOnly?: boolean;
  prodOnly?: boolean;
};

export function parseFilterOptions(args: RawArgs): FilterOptions {
  const options: FilterOptions = {};

  if (args.onlyChanged) {
    options.onlyChanged = true;
  }

  if (args.devOnly) {
    options.devOnly = true;
  }

  if (args.prodOnly) {
    options.prodOnly = true;
  }

  if (args.include) {
    options.include = args.include.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (args.exclude) {
    options.exclude = args.exclude.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (options.devOnly && options.prodOnly) {
    throw new Error('Cannot use --dev-only and --prod-only together');
  }

  return options;
}
