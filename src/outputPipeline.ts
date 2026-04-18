import { DiffEntry } from './diffEngine';
import { filterDiff } from './filter';
import { FilterOptions } from './filterOptions';
import { format } from './formatter';
import { OutputFormat } from './outputFormat';
import { OutputOptions, writeOutput } from './outputWriter';
import { sortDiff } from './sorter';
import { SortOptions } from './sortOptions';

export interface PipelineOptions {
  filter?: Partial<FilterOptions>;
  sort?: Partial<SortOptions>;
  format: OutputFormat;
  output: OutputOptions;
}

export function runOutputPipeline(
  diff: DiffEntry[],
  options: PipelineOptions
): void {
  let result = [...diff];

  if (options.filter) {
    result = filterDiff(result, options.filter as FilterOptions);
  }

  if (options.sort) {
    result = sortDiff(result, options.sort as SortOptions);
  }

  const formatted = format(result, options.format);
  writeOutput(formatted, options.output);
}
