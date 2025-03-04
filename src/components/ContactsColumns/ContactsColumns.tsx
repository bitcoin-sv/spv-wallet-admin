import { Contact } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { Badge, Button, DateCell } from '@/components';
import { getSortDirection } from '@/utils';
import SortIcon from '../ui/sort-icon';
import { Shortener } from '@/components/Shortener.tsx';

export const enum ContactStatus {
  Confirmed = 'confirmed',
  Rejected = 'rejected',
  Unconfirmed = 'unconfirmed',
  Awaiting = 'awaiting',
}

export const contactsColumns: ColumnDef<Contact>[] = [
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
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'full_name',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Full Name
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'paymail',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'paymail',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Paymail
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'pubKey',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'pub_key',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            PubKey
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      return <Shortener
        title="XPubID"
        value={row.getValue('pubKey')}
      />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'status',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Status
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      return row.original.deletedAt ? (
        <Badge variant="destructive">Deleted</Badge>
      ) : row.getValue('status') === ContactStatus.Confirmed ? (
        <Badge variant="outline">Confirmed</Badge>
      ) : row.getValue('status') === ContactStatus.Rejected ? (
        <Badge variant="secondary">Rejected</Badge>
      ) : row.getValue('status') === ContactStatus.Unconfirmed ? (
        <Badge variant="secondary">Unconfirmed</Badge>
      ) : row.getValue('status') === ContactStatus.Awaiting ? (
        <Badge>Awaiting</Badge>
      ) : null;
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
