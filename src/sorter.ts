export type SortField = 'name' | 'version' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export interface DiffEntry {
  name: string;
  type: 'added' | 'removed' | 'changed' | 'unchanged';
  oldVersion?: string;
  newVersion?: string;
}

export function parseSortOptions(args: string[]): SortOptions {
  const fieldIndex = args.indexOf('--sort');
  const orderIndex = args.indexOf('--sort-order');

  const field = (fieldIndex !== -1 ? args[fieldIndex + 1] : 'name') as SortField;
  const order = (orderIndex !== -1 ? args[orderIndex + 1] : 'asc') as SortOrder;

  const validFields: SortField[] = ['name', 'version', 'type'];
  const validOrders: SortOrder[] = ['asc', 'desc'];

  return {
    field: validFields.includes(field) ? field : 'name',
    order: validOrders.includes(order) ? order : 'asc',
  };
}

export function sortDiff(entries: DiffEntry[], options: SortOptions): DiffEntry[] {
  const sorted = [...entries].sort((a, b) => {
    let cmp = 0;
    if (options.field === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (options.field === 'type') {
      cmp = a.type.localeCompare(b.type);
    } else if (options.field === 'version') {
      const av = a.newVersion ?? a.oldVersion ?? '';
      const bv = b.newVersion ?? b.oldVersion ?? '';
      cmp = av.localeCompare(bv);
    }
    return options.order === 'desc' ? -cmp : cmp;
  });
  return sorted;
}
