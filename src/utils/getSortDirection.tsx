import { Column, SortDirection } from '@tanstack/react-table';

export const getSortDirection = <T, U>(column: Column<T, U>): SortDirection => {
  const isSorted = column.getIsSorted();
  return isSorted === false ? 'desc' : isSorted;
};
