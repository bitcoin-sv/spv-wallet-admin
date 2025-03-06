import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface UsePaginationProps<TData> {
  table: Table<TData>;
  manualPagination?: boolean;
  totalRecords?: number;
}

interface UsePaginationResult {
  total: number;
  currentPageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  handlePageSizeChange: (value: string) => void;
  handlePageChange: (newPageIndex: number) => void;
}

export function usePagination<TData>({
  table,
  manualPagination = false,
  totalRecords,
}: UsePaginationProps<TData>): UsePaginationResult {
  // For manual pagination, use the provided totalRecords, otherwise use the filtered rows length
  const total = manualPagination && totalRecords !== undefined ? totalRecords : table.getFilteredRowModel().rows.length;

  // Track the current page size in local state to ensure the UI stays in sync
  const [currentPageSize, setCurrentPageSize] = useState<number>(table.getState().pagination.pageSize);

  // Initialize currentPageSize on mount and when table changes
  useEffect(() => {
    setCurrentPageSize(table.getState().pagination.pageSize);
  }, [table]);

  // Update local state when table pagination state changes
  useEffect(() => {
    // Always update the local state to match the table's page size
    setCurrentPageSize(table.getState().pagination.pageSize);
  }, [table.getState().pagination.pageSize]);

  useEffect(() => {
    setCurrentPageSize(table.getState().pagination.pageSize);
  }, [table.getState().pagination]);

  // Custom logic to determine if we can navigate to previous/next pages
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);

    // Update local state
    setCurrentPageSize(newSize);

    // Update table state - this will trigger the onPaginationChange callback in the parent
    table.setPageSize(newSize);
  };

  // Add a direct page change handler to ensure proper updates
  const handlePageChange = (newPageIndex: number) => {
    // Only update if the page is actually changing
    if (newPageIndex !== table.getState().pagination.pageIndex) {
      // Update the table's page index
      table.setPageIndex(newPageIndex);
    }
  };

  return {
    total,
    currentPageSize,
    canPreviousPage,
    canNextPage,
    handlePageSizeChange,
    handlePageChange,
  };
}
