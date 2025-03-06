import {
  ColumnDef,
  ColumnSort,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect } from 'react';
import { PaginationProps, RowType } from './DataTable';

const defaultInitialSorting: ColumnSort[] = [{ id: 'id', desc: false }];

interface UseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialSorting?: ColumnSort[];
  pagination?: PaginationProps;
  manualPagination?: boolean;
}

export function useTable<TData extends RowType, TValue>({
  columns,
  data,
  initialSorting,
  pagination,
  manualPagination = false,
}: UseTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: initialSorting ? initialSorting : defaultInitialSorting,
      pagination: pagination
        ? {
            pageIndex: pagination.currentPage,
            pageSize: pagination.pageSize,
          }
        : {
            pageIndex: 0,
            pageSize: 10,
          },
    },
    manualPagination,
    pageCount: manualPagination && pagination ? Math.max(1, pagination.totalPages) : undefined,
    onPaginationChange:
      manualPagination && pagination
        ? (updater) => {
            const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;

            // Handle page index change
            if (newState.pageIndex !== table.getState().pagination.pageIndex) {
              pagination.onPageChange(newState.pageIndex);
            }

            // Only call onPageSizeChange when the page size actually changes
            if (newState.pageSize !== undefined && newState.pageSize !== table.getState().pagination.pageSize) {
              pagination.onPageSizeChange(newState.pageSize);
            }
          }
        : undefined,
  });

  // Ensure page size changes are properly propagated
  useEffect(() => {
    if (manualPagination && pagination) {
      // Force update the table state to match pagination props
      table.setState((old) => ({
        ...old,
        pagination: {
          ...old.pagination,
          pageSize: pagination.pageSize,
          pageIndex: pagination.currentPage,
        },
      }));
    }
  }, [pagination?.pageSize, pagination?.currentPage, manualPagination, table]);

  return {
    table,
    currentPageData: table.getRowModel().rows.map((row) => row.original),
  };
}
