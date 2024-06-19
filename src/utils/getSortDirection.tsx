import { Column } from '@tanstack/react-table';

export type SortDirection = 'asc' | 'desc';

export const getSortDirection = <T, U>(column: Column<T, U>): SortDirection => {
  const isSorted = column.getIsSorted();
  return isSorted === false ? 'asc' : isSorted;
};
