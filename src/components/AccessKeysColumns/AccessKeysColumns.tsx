import { AccessKey } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { Badge, DateCell } from '@/components';

import { Button } from '@/components/ui';
import { getSortDirection } from '@/utils';
import SortIcon from '../ui/sort-icon';
import { useIsUser } from '@/store/clientStore.ts';

export interface AccessKeysColumns extends AccessKey {
  status: string;
}

export const accessKeysColumns: ColumnDef<AccessKeysColumns>[] = [
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
    accessorKey: 'xpubId',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'xpub_id',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Xpub ID
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      const isUser = useIsUser();
      if (isUser) {
        return row.getValue('xpubId');
      }
      return <Link to={`/admin/xpub`} search={{ id: row.getValue('xpubId') as string }}>
        <Button variant="link">{row.getValue('xpubId')}</Button>
      </Link>;
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
      return row.getValue('status') === 'deleted' ? (
        <Badge variant="secondary">Deleted</Badge>
      ) : row.getValue('status') === 'revoked' ? (
        <Badge variant="secondary">Revoked</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      );
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
