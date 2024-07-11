import { Tx } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import { getSortDirection } from '@/utils';

export const columns: ColumnDef<Tx>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Link
          search={(prev) => ({
            ...prev,
            order_by_field: 'id',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'block_height',
    header: ({ column }) => {
      return (
        <Link
          search={(prev) => ({
            ...prev,
            order_by_field: 'block_height',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Block Height
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Link
          search={(prev) => ({
            ...prev,
            order_by_field: 'created_at',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Created Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      return row.getValue('created_at') && new Date(row.getValue('created_at')).toLocaleString();
    },
  },
];
