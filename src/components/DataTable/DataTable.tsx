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
import { AccessKey, Contact, PaymailAddress, Tx, XPub } from '@bsv/spv-wallet-js-client';
import { ColumnDef, ColumnSort, flexRender, Row } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import React from 'react';
import { useTable } from './useTable';
import { ContactExtended } from '@/interfaces/contacts';
import { PaymailExtended } from '@/interfaces/paymail';
import { XpubExtended } from '@/interfaces';

export type RowType =
  | XPub
  | Contact
  | AccessKey
  | PaymailAddress
  | Tx
  | ContactExtended
  | PaymailExtended
  | XpubExtended
  | { id?: string; url?: string; status?: string };

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderItem?: (row: Row<TData>) => React.ReactNode;
  renderInlineItem?: (row: Row<TData>) => React.ReactNode;
  initialSorting?: ColumnSort[];
  pagination?: PaginationProps;
}

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

export function DataTable<TData extends RowType, TValue>({
  columns,
  data,
  renderItem,
  renderInlineItem,
  initialSorting,
  pagination,
}: DataTableProps<TData, TValue>) {
  // Use the enhanced columns with actions
  const enhancedColumns = getColumns(columns, renderItem, renderInlineItem);

  // Use our shared table hook
  const { table } = useTable({
    columns: enhancedColumns,
    data,
    initialSorting,
    pagination,
  });

  // Deduce manualPagination from the presence of pagination prop
  const isManualPagination = !!pagination;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-50">
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
      <DataTablePagination
        table={table}
        manualPagination={isManualPagination}
        totalRecords={pagination?.totalElements}
      />
    </div>
  );
}
