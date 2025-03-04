import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { DateCell } from '@/components';
import { Button } from '@/components/ui';
import { getSortDirection, renderTransactionStatusBadge } from '@/utils';
import SortIcon from '../ui/sort-icon';
import { TransactionExtended } from '@/interfaces/transaction';
import { TransactionStatusValue } from '@/constants';

export const columns: ColumnDef<TransactionExtended>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'id',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Id
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'blockHeight',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'block_height',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Block Height
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          <SortIcon column={column} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as TransactionStatusValue;
      return renderTransactionStatusBadge(status);
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'created_at',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Created Date
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => <DateCell date={row.getValue('createdAt')} />,
  },
];
