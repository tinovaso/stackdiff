import { SortField, SortOrder, SortOptions } from './sorter';

export const SORT_FIELDS: SortField[] = ['name', 'version', 'type'];
export const SORT_ORDERS: SortOrder[] = ['asc', 'desc'];

export function sortOptionsHelp(): string {
  return [
    '  --sort <field>        Sort results by field: name, version, type (default: name)',
    '  --sort-order <order>  Sort order: asc, desc (default: asc)',
  ].join('\n');
}

export function validateSortOptions(options: SortOptions): string[] {
  const errors: string[] = [];
  if (!SORT_FIELDS.includes(options.field)) {
    errors.push(`Invalid sort field "${options.field}". Valid fields: ${SORT_FIELDS.join(', ')}`);
  }
  if (!SORT_ORDERS.includes(options.order)) {
    errors.push(`Invalid sort order "${options.order}". Valid orders: ${SORT_ORDERS.join(', ')}`);
  }
  return errors;
}

export function defaultSortOptions(): SortOptions {
  return { field: 'name', order: 'asc' };
}
