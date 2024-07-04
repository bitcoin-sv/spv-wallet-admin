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

import { DataTablePagination } from '@/components/DataTable/DataTablePagination.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isEdit?: boolean;
  isDelete?: boolean;
  onDelete?: (alias: string, domain: string) => void;
}

export const initialSorting = { id: 'id', desc: false };

export function DataTable<TData, TValue>({ columns, data, isDelete, onDelete }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([initialSorting]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDelete = (alias: string, domain: string) => {
    if (onDelete) {
      onDelete(alias, domain);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const renderInfo = (obj: TData) =>
    Object.entries(obj as NonNullable<unknown>).map((item) => {
      const [field, value] = item;
      if (field === 'status') {
        return;
      }

      if (field === 'metadata') {
        return <div key={field}>metadata: {JSON.stringify(value) as React.ReactNode}</div>;
      }

      return (
        <div key={field} className="break-all">
          {field}: {value as React.ReactNode}
        </div>
      );
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Dialog>
                        <DialogTrigger className="w-full">
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View</DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Details</DialogTitle>
                            <DialogDescription>Show full information</DialogDescription>
                          </DialogHeader>
                          {renderInfo(row.original)}
                        </DialogContent>
                      </Dialog>
                      {isDelete && (
                        <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen}>
                          <DialogTrigger className="w-full">
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. Please confirm your decision to proceed.
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(row.getValue('alias'), row.getValue('domain'))}
                            >
                              Delete
                            </Button>
                            <Button variant="ghost" onClick={handleDeleteDialogOpen}>
                              Cancel
                            </Button>
                          </DialogContent>
                        </Dialog>
                      )}
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
