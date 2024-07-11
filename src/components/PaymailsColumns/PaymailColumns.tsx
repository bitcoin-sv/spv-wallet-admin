import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

import { PaymailAddress } from '@bsv/spv-wallet-js-client';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import React from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';

import { Button } from '@/components/ui/button.tsx';
import { getSortDirection } from '@/utils';

export interface PaymailColumns extends PaymailAddress {
  status: string;
}

const onClickCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
  const text = e.currentTarget.textContent;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  toast.success(`Xpub ID Copied to clipboard`);
};

export const paymailColumns: ColumnDef<PaymailColumns>[] = [
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
    accessorKey: 'xpub_id',
    header: ({ column }) => {
      return (
        <Link
          search={(prev) => ({
            ...prev,
            order_by_field: 'xpub_id',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Xpub ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      return (
        row.getValue('xpub_id') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="align-middle">
                <span
                  onClick={onClickCopy}
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100px] block"
                >
                  {row.getValue('xpub_id')}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.getValue('xpub_id')}</p>
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
          search={(prev) => ({
            ...prev,
            order_by_field: 'alias',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Alias
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
          search={(prev) => ({
            ...prev,
            order_by_field: 'domain',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Domain
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'public_name',
    header: ({ column }) => {
      return (
        <Link
          search={(prev) => ({
            ...prev,
            order_by_field: 'public_name',
            sort_direction: getSortDirection(column),
          })}
        >
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Public Name
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
      ) : row.getValue('status') === 'revoked' ? (
        <Badge variant="secondary">Revoked</Badge>
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
