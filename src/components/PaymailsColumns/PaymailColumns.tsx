import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

import { PaymailAddress } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import React from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';

import { DateCell } from '@/components';
import { Badge, Button } from '@/components/ui';
import { getSortDirection } from '@/utils';
import SortIcon from '../ui/sort-icon';

export interface PaymailColumns extends PaymailAddress {
  status: string;
}

const onClickCopy = (columnName: string) => async (e: React.MouseEvent<HTMLButtonElement>) => {
  const text = e.currentTarget.textContent;

  if (!text) {
    return;
  }

  await navigator.clipboard.writeText(text);
  toast.success(`${columnName} Copied to clipboard`);
};

export const paymailColumns: ColumnDef<PaymailColumns>[] = [
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
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="align-middle">
            <span
              onClick={onClickCopy('ID')}
              className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100px] block"
            >
              {row.getValue('id')}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue('id')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },

  {
    accessorKey: 'avatar',
    header: () => {
      return (
        <Link>
          <Button variant="ghost">Avatar</Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      return (
        row.getValue('avatar') && (
          <Avatar>
            <AvatarImage className="object-cover" src={row.getValue('avatar')} />
            <AvatarFallback>{row.getValue('alias')}</AvatarFallback>
          </Avatar>
        )
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
      return (
        row.getValue('xpubId') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="align-middle">
                <span
                  onClick={onClickCopy('Xpub ID')}
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100px] block"
                >
                  {row.getValue('xpubId')}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.getValue('xpubId')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      );
    },
  },
  {
    accessorKey: 'alias',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'alias',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Alias
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'domain',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'domain',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Domain
            <SortIcon column={column} />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'publicName',
    header: ({ column }) => {
      return (
        <Link
          to={'.'}
          search={(prev) => ({
            ...prev,
            sortBy: 'public_name',
            sort: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Public Name
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
    cell: ({ row }) => <DateCell date={row.getValue("createdAt")} />,
  },
];
