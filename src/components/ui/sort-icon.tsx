import { getSortDirection } from '@/utils';
import { Column } from '@tanstack/react-table';
import { ArrowDownWideNarrow, ArrowUpDown, ArrowUpNarrowWide } from 'lucide-react';

type SortIconProps<T, U> = {
  column: Column<T, U>;
};

function SortIcon<T, U>({ column }: SortIconProps<T, U>) {
  if (!column.getIsSorted()) {
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  }

  return getSortDirection(column) === 'asc' ? (
    <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
  ) : (
    <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
  );
}

export default SortIcon;
