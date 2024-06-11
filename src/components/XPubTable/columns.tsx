import { ColumnDef } from '@tanstack/react-table';
import { XPub } from '@bsv/spv-wallet-js-client';
import { Badge } from '@/components/ui/badge.tsx';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Link } from '@tanstack/react-router';

export interface XpubsColumns extends XPub {
  status: string;
}

export const columns: ColumnDef<XpubsColumns>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Link
          from={'/xpub'}
          search={{
            order_by_field: 'id',
            sort_direction: column.getIsSorted() === false ? 'asc' : (column.getIsSorted() as string),
          }}
        >
          {/*<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>*/}
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            {/*<Button variant="ghost">*/}
            Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'current_balance',
    header: ({ column }) => {
      return (
        <Link
          from={'/xpub'}
          search={{
            order_by_field: 'current_balance',
            sort_direction: column.getIsSorted() === false ? 'asc' : (column.getIsSorted() as string),
          }}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.getValue('status') === 'deleted' ? (
        <Badge variant="secondary">Deleted</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Link
          from={'/xpub'}
          search={{
            order_by_field: 'created_at',
            sort_direction: column.getIsSorted() === false ? 'asc' : (column.getIsSorted() as string),
          }}
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
