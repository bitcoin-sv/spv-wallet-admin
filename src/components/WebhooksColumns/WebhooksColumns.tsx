import { Badge, Button } from '@/components/ui';
import { getSortDirection } from '@/utils';
import { Webhook } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

export interface WebhooksColumns extends Webhook {
  status: string;
}

export const webhookColumns: ColumnDef<WebhooksColumns>[] = [
  {
    accessorKey: 'url',
    header: ({ column }) => {
      return (
        <Link
          search={(prev) => ({
            ...prev,
            order_by_field: 'url',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            URL
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
      return row.getValue('status') === 'banned' ? (
        <Badge variant="secondary">Banned</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      );
    },
  },
];
