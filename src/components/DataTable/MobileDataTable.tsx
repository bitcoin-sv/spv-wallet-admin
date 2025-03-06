import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { createToggleExpandAll } from '@/utils/expandUtils';
import { ColumnDef, ColumnSort } from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import { MobileDataTablePagination } from './MobileDataTablePagination';
import { RowType, PaginationProps } from './DataTable';
import { useTable } from './useTable';

interface MobileDataTableProps<TData extends RowType, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderMobileItem: (
    item: TData,
    expandedState: { expandedItems: string[]; setExpandedItems: (value: string[]) => void },
  ) => React.ReactNode;
  initialSorting?: ColumnSort[];
  pagination?: PaginationProps;
  manualPagination?: boolean;
}

export function MobileDataTable<TData extends RowType, TValue>({
  columns,
  data,
  renderMobileItem,
  initialSorting,
  pagination,
  manualPagination = false,
}: MobileDataTableProps<TData, TValue>) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const { table, currentPageData } = useTable({
    columns,
    data,
    initialSorting,
    pagination,
    manualPagination,
  });

  // Reset expanded state when page or page size changes
  useEffect(() => {
    setExpandedItems([]);
    setIsAllExpanded(false);
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize]);

  const toggleExpandAll = () => {
    createToggleExpandAll(currentPageData, isAllExpanded, setExpandedItems, setIsAllExpanded);
  };

  return (
    <div className="rounded-md border">
      <div className="p-2 border-b">
        <Button variant="ghost" onClick={toggleExpandAll} className="w-full flex items-center justify-center gap-2">
          {isAllExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Expand All
            </>
          )}
        </Button>
      </div>
      <div className="p-1">
        <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems} className="w-full">
          {currentPageData.map((item) => (
            <React.Fragment key={item.id || `webhook-${(item as { url?: string }).url}`}>
              {renderMobileItem(item, { expandedItems, setExpandedItems })}
            </React.Fragment>
          ))}
        </Accordion>
      </div>
      <MobileDataTablePagination
        table={table}
        manualPagination={manualPagination}
        totalRecords={pagination?.totalElements}
      />
    </div>
  );
}
