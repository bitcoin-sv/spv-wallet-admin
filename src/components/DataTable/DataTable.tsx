import {
  Button,
  DataTablePagination,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { AccessKey, Contact, OldPaymailAddress, Tx, XPub } from '@bsv/spv-wallet-js-client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import React from 'react';

export type RowType = XPub | Contact | AccessKey | OldPaymailAddress | Tx;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderItem?: (row: Row<TData>) => React.ReactNode;
  renderInlineItem?: (row: Row<TData>) => React.ReactNode;
}

const initialSorting = { id: 'id', desc: false };

const getColumns = <TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
  renderItem?: (row: Row<TData>) => React.ReactNode,
  renderInlineItem?: (row: Row<TData>) => React.ReactNode,
): ColumnDef<TData, TValue>[] => {
  if (renderInlineItem) {
    columns = [
      ...columns,
      {
        id: 'extraActions',
        cell: ({ row }) => <>{renderInlineItem(row)}</>,
      },
    ];
  }

  if (renderItem) {
    columns = [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {renderItem ? renderItem(row) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }

  return columns;
};
export function DataTable<TData, TValue>({
  columns,
  data,
  renderItem,
  renderInlineItem,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: getColumns(columns, renderItem, renderInlineItem),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [initialSorting],
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
