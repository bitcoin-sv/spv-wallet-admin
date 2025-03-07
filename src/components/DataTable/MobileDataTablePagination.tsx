import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { PAGE_SIZES } from '@/constants';
import { usePagination } from './usePagination';

interface MobileDataTablePaginationProps<TData> {
  table: Table<TData>;
  manualPagination?: boolean;
  totalRecords?: number;
}

export function MobileDataTablePagination<TData>({
  table,
  manualPagination = false,
  totalRecords,
}: MobileDataTablePaginationProps<TData>) {
  const { total, currentPageSize, canPreviousPage, canNextPage, handlePageSizeChange, handlePageChange } =
    usePagination({
      table,
      manualPagination,
      totalRecords,
    });

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div data-testid="table_total" className="text-sm text-muted-foreground">
        Total records: {total}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={`${currentPageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${currentPageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZES.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                handlePageChange(Math.max(0, table.getState().pagination.pageIndex - 1));
              }}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                handlePageChange(Math.min(table.getPageCount() - 1, table.getState().pagination.pageIndex + 1));
              }}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
