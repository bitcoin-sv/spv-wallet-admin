import { Table } from '@tanstack/react-table';
import { useEffect, useState, useCallback } from 'react';
import { AnyRouter, RegisteredRouter, RouteIds, useNavigate } from '@tanstack/react-router';
import { DEFAULT_API_PAGE, DEFAULT_PAGE_SIZE, convertToApiPage } from '@/constants/pagination';
import type { ConstrainLiteral } from '@tanstack/router-core';

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

/**
 * Custom hook for handling pagination in routes
 * @param routeID - The route ID to navigate to
 * @returns Pagination handlers
 */
export function useRoutePagination<TRouter extends AnyRouter = RegisteredRouter, const TFrom extends string = string>(
  routeID: ConstrainLiteral<TFrom, RouteIds<TRouter['routeTree']>>,
) {
  // Get the navigate function from the router with proper typing
  const navigate = useNavigate<TRouter, TFrom>({ from: routeID });

  /**
   * Handle page change
   * @param newPage - The new page index (0-indexed)
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      // @ts-expect-error - Generic navigation with search params
      navigate({
        search: (old: Record<string, object>) => ({
          ...old,
          page: convertToApiPage(newPage), // convert to 1-indexed API page
          size: old.size || DEFAULT_PAGE_SIZE,
        }),
        replace: true,
      }).catch(console.error);
    },
    [navigate],
  );

  /**
   * Handle page size change
   * @param newSize - The new page size
   */
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // @ts-expect-error - Generic navigation with search params
      navigate({
        search: (old) => ({
          ...old,
          size: newSize,
          page: DEFAULT_API_PAGE, // Reset to first page when changing page size
        }),
        replace: true,
      }).catch(console.error);
    },
    [navigate],
  );

  return {
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  };
}
