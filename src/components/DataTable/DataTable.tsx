import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  Row,
} from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import React, { useState } from 'react';

import {
  ContactStatus,
  ContactDeleteDialogProps,
  ContactEditDialogProps,
  ContactAcceptDialogProps,
  DataTablePagination,
  Button,
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
  ViewDialog,
  ContactRejectDialogProps,
  RevokeKeyDialogProps,
  TransactionEditDialogProps,
  DestinationEditDialogProps,
  PaymailDeleteDialogProps,
} from '@/components';
import { AccessKey, Contact, Destination, PaymailAddress, Tx, XPub } from '@bsv/spv-wallet-js-client';

export type RowType = XPub | Contact | AccessKey | Destination | PaymailAddress | Tx;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  ContactEditDialog?: React.ComponentType<ContactEditDialogProps>;
  TransactionEditDialog?: React.ComponentType<TransactionEditDialogProps>;
  DestinationEditDialog?: React.ComponentType<DestinationEditDialogProps>;
  AcceptDialog?: React.ComponentType<ContactAcceptDialogProps>;
  DeleteDialog?: React.ComponentType<ContactDeleteDialogProps>;
  RejectDialog?: React.ComponentType<ContactRejectDialogProps>;
  RevokeKeyDialog?: React.ComponentType<RevokeKeyDialogProps>;
  PaymailDeleteDialog?: React.ComponentType<PaymailDeleteDialogProps>;
}

const initialSorting = { id: 'id', desc: false };

export function DataTable<TData, TValue>({
  columns,
  data,
  ContactEditDialog,
  TransactionEditDialog,
  DestinationEditDialog,
  AcceptDialog,
  DeleteDialog,
  RejectDialog,
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
                      {AcceptDialog ? <AcceptDialog row={row as Row<Contact>} /> : null}
                      {RejectDialog ? <RejectDialog row={row as Row<Contact>} /> : null}
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
                      {ContactEditDialog ? <ContactEditDialog row={row as Row<Contact>} /> : null}
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
