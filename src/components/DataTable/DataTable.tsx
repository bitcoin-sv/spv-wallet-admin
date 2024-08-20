import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import React, { useState } from 'react';

import {
  Button,
  ContactDeleteDialogProps,
  ContactStatus,
  DataTablePagination,
  DestinationEditDialogProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  PaymailDeleteDialogProps,
  RevokeKeyDialogProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TransactionEditDialogProps,
  ViewDialog,
} from '@/components';
import { AccessKey, Contact, Destination, PaymailAddress, Tx, XPub } from '@bsv/spv-wallet-js-client';

export type RowType = XPub | Contact | AccessKey | Destination | PaymailAddress | Tx;

export type RowProps<TData> = {
  row: Row<TData>;
};

export type ActionComponent<TData> = React.ComponentType<RowProps<TData>>;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: ActionComponent<TData>[];
  inlineActions?: ActionComponent<TData>[];
  TransactionEditDialog?: React.ComponentType<TransactionEditDialogProps>;
  DestinationEditDialog?: React.ComponentType<DestinationEditDialogProps>;
  DeleteDialog?: React.ComponentType<ContactDeleteDialogProps>;
  RevokeKeyDialog?: React.ComponentType<RevokeKeyDialogProps>;
  PaymailDeleteDialog?: React.ComponentType<PaymailDeleteDialogProps>;
}

const initialSorting = { id: 'id', desc: false };

export function DataTable<TData, TValue>({
  columns,
  data,
  actions,
  inlineActions,
  TransactionEditDialog,
  DestinationEditDialog,
  DeleteDialog,
  RevokeKeyDialog,
  PaymailDeleteDialog,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([initialSorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    initialState: {
      sorting: [initialSorting],
    },
    state: {
      sorting,
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
                <TableCell>
                  {table.getColumn('status') && row.getValue('status') === ContactStatus.Awaiting ? (
                    <div className="grid grid-cols-2 items-center w-fit gap-4 ">
                      {inlineActions?.map((Action, index) => <Action key={index} row={row} />)}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <ViewDialog row={row as Row<RowType>} />
                      {actions?.map((Action, index) => <Action key={index} row={row} />)}
                      {TransactionEditDialog ? <TransactionEditDialog row={row as Row<Tx>} /> : null}
                      {DestinationEditDialog ? <DestinationEditDialog row={row as Row<Destination>} /> : null}
                      {DeleteDialog ? <DeleteDialog row={row as Row<Contact>} /> : null}
                      {PaymailDeleteDialog ? <PaymailDeleteDialog row={row as Row<PaymailAddress>} /> : null}
                      {RevokeKeyDialog ? <RevokeKeyDialog row={row as Row<AccessKey>} /> : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
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
