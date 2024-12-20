import { Contact } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Badge, Button } from '@/components';
import { getSortDirection } from '@/utils';

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
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            order_by_field: 'full_name',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            order_by_field: 'paymail',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Paymail
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            order_by_field: 'pub_key',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            PubKey
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
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            order_by_field: 'status',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
      return row.getValue('createdAt') && new Date(row.getValue('createdAt')).toLocaleString();
    },
  },
];
