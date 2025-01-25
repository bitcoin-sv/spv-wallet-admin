import { Badge, Button } from '@/components/ui';
import { getSortDirection } from '@/utils';
import { Webhook } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import SortIcon from '../ui/sort-icon';

export interface WebhooksColumns extends Webhook {
  status: string;
}

export const webhookColumns: ColumnDef<WebhooksColumns>[] = [
  {
    accessorKey: 'url',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'url',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            URL
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
      return row.getValue('status') === 'banned' ? (
        <Badge variant="secondary">Banned</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      );
    },
  },
];
