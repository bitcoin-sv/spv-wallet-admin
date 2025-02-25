import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewDialogMobile } from '@/components/ViewDialog/ViewDialogMobile';
import { RevokeKeyDialog } from '@/components';
import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { MobileDataTablePagination } from '@/components/DataTable/MobileDataTablePagination';
import { AccessKeysColumns } from './AccessKeysColumns';
import { isUser } from '@/store/clientStore';
import { truncateId } from '@/utils/string';

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {return};
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

interface AccessKeyMobileItemProps {
  accessKey: AccessKeysColumns;
}

export const AccessKeyMobileItem = ({ accessKey }: AccessKeyMobileItemProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    return accessKey.status === 'deleted' ? (
      <Badge variant="secondary">Deleted</Badge>
    ) : accessKey.status === 'revoked' ? (
      <Badge variant="secondary">Revoked</Badge>
    ) : (
      <Badge variant="outline">Active</Badge>
    );
  };

  const mobileRow: Row<AccessKeysColumns> = {
    original: accessKey,
    getValue: (key: string) => {
      if (key === 'status') {return accessKey.status};
      return undefined;
    },
  } as Row<AccessKeysColumns>;

  return (
    <AccordionItem value={accessKey.id} className="px-2">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 space-y-1 text-left">
            <p className="text-sm font-medium leading-none flex items-center gap-2">
              <span className="shrink-0">ID:</span>
              <span className="truncate">{truncateId(accessKey.id)}</span>
            </p>
            <p className="text-sm text-muted-foreground">{getStatusBadge()}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium">ID:</span>
            <span className="cursor-pointer truncate" onClick={onClickCopy(accessKey.id, 'ID')}>
              {accessKey.id}
            </span>

            {accessKey.xpubId && (
              <>
                <span className="font-medium">Xpub ID:</span>
                <span className="cursor-pointer truncate" onClick={onClickCopy(accessKey.xpubId, 'Xpub ID')}>
                  {accessKey.xpubId}
                </span>
              </>
            )}

            <span className="font-medium">Status:</span>
            <span>{getStatusBadge()}</span>

            <span className="font-medium">Created:</span>
            <span>{formatDate(new Date(accessKey.createdAt))}</span>
          </div>

          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <ViewDialogMobile data={accessKey} />
                </DropdownMenuItem>
                {accessKey.status !== 'revoked' && accessKey.status !== 'deleted' && isUser() && (
                  <RevokeKeyDialog row={mobileRow} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export interface AccessKeysMobileListProps {
  accessKeys: AccessKeysColumns[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export const AccessKeysMobileList = ({ accessKeys, value, onValueChange }: AccessKeysMobileListProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(value || []);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const table = useReactTable({
    data: accessKeys,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const currentPageData = table.getRowModel().rows.map((row) => row.original);

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedItems([]);
      onValueChange?.([]);
    } else {
      const ids = currentPageData.map((accessKey) => accessKey.id);
      setExpandedItems(ids);
      onValueChange?.(ids);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const handleValueChange = (newValue: string[]) => {
    setExpandedItems(newValue);
    onValueChange?.(newValue);
    setIsAllExpanded(newValue.length === currentPageData.length);
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
        <Accordion type="multiple" value={expandedItems} onValueChange={handleValueChange} className="w-full">
          {currentPageData.map((accessKey) => (
            <AccessKeyMobileItem key={accessKey.id} accessKey={accessKey} />
          ))}
        </Accordion>
      </div>
      <MobileDataTablePagination table={table} />
    </div>
  );
};
