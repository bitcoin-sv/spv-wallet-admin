import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AccessKey, Contact, PaymailAddress, Tx, XPub } from '@bsv/spv-wallet-js-client';
import { createToggleExpandAll } from '@/utils/expandUtils';
import {
  ColumnDef,
  ColumnSort,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { MobileDataTablePagination } from './MobileDataTablePagination';

export type RowType = XPub | Contact | AccessKey | PaymailAddress | Tx | { id?: string; url?: string };

interface MobileDataTableProps<TData extends RowType, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderMobileItem: (
    item: TData,
    expandedState: { expandedItems: string[]; setExpandedItems: (value: string[]) => void },
  ) => React.ReactNode;
  initialSorting?: ColumnSort[];
}

const defaultInitialSorting: ColumnSort[] = [{ id: 'id', desc: false }];

export function MobileDataTable<TData extends RowType, TValue>({
  columns,
  data,
  renderMobileItem,
  initialSorting,
}: MobileDataTableProps<TData, TValue>) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: initialSorting ? initialSorting : defaultInitialSorting,
    },
  });

  const currentPageData = table.getRowModel().rows.map((row) => row.original);

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
      <MobileDataTablePagination table={table} />
    </div>
  );
}
