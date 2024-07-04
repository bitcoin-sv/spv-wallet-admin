import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
} from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import React, { useState } from 'react';

import { ContactDeleteDialogProps } from 'src/components/ContactDeleteDialog';
import { ContactEditDialogProps } from 'src/components/ContactEditDialog';

import { ContactAcceptDialogProps } from '@/components/ContactAcceptDialog/ContactAcceptDialog.tsx';
import { ContactRejectDialogProps } from '@/components/ContactRejectDialog';
import { ContactStatus } from '@/components/ContactsColumns/ContactsColumns.tsx';
import { DataTablePagination } from '@/components/DataTable/DataTablePagination.tsx';
import { Button } from '@/components/ui/button.tsx';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { ViewDialog } from '@/components/ViewDialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  EditDialog?: React.ComponentType<ContactEditDialogProps>;
  AcceptDialog?: React.ComponentType<ContactAcceptDialogProps>;
  DeleteDialog?: React.ComponentType<ContactDeleteDialogProps>;
  RejectDialog?: React.ComponentType<ContactRejectDialogProps>;
}

export const initialSorting = { id: 'id', desc: false };

export function DataTable<TData, TValue>({
  columns,
  data,
  EditDialog,
  AcceptDialog,
  DeleteDialog,
  RejectDialog,
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
        <TableHeader>
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
                  {row.getValue('status') === ContactStatus.Awaiting ? (
                    <div className="grid grid-cols-2 items-center w-fit gap-4 ">
                      {AcceptDialog ? <AcceptDialog row={row} /> : null}
                      {RejectDialog ? <RejectDialog row={row} /> : null}
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
                      <ViewDialog row={row} />
                      {EditDialog ? <EditDialog row={row} /> : null}
                      {DeleteDialog ? <DeleteDialog row={row} /> : null}
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
