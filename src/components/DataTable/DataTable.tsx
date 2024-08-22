import {
  Button,
  ContactAcceptDialog,
  ContactDeleteDialog,
  ContactEditDialog,
  ContactRejectDialog,
  ContactStatus,
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
  ViewDialog,
} from '@/components';
import { isContact } from '@/utils';
import { AccessKey, Contact, Destination, PaymailAddress, Tx, XPub } from '@bsv/spv-wallet-js-client';
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

export type RowType = XPub | Contact | AccessKey | Destination | PaymailAddress | Tx;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderItem?: (row: Row<RowType>) => React.ReactNode;
}

const initialSorting = { id: 'id', desc: false };

export function DataTable<TData, TValue>({ columns, data, renderItem }: DataTableProps<TData, TValue>) {
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
                      {isContact(row.original) && row.original.status === ContactStatus.Awaiting && (
                        <>
                          <ContactAcceptDialog row={row as Row<Contact>} />
                          <ContactRejectDialog row={row as Row<Contact>} />
                        </>
                      )}
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
                      {renderItem ? renderItem(row as Row<RowType>) : null}
                      {isContact(row.original) && <ContactEditDialog row={row as Row<Contact>} />}
                      {isContact(row.original) && <ContactDeleteDialog row={row as Row<Contact>} />}
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
