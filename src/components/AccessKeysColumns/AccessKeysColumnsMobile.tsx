import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewDialogMobile } from '@/components/ViewDialog/ViewDialogMobile';
import { RevokeKeyDialog } from '@/components';
import { Row } from '@tanstack/react-table';
import { MobileDataTable } from '@/components/DataTable/MobileDataTable';
import { AccessKeysColumns } from './AccessKeysColumns';
import { useIsUser } from '@/store/clientStore';
import { truncateId } from '@/utils/string';
import { PaginationProps } from '../DataTable/DataTable';
import { AccessKey } from '@bsv/spv-wallet-js-client';

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

interface AccessKeyMobileItemProps {
  accessKey: AccessKeysColumns;
  expandedState: { expandedItems: string[]; setExpandedItems: (value: string[]) => void };
}

export const AccessKeyMobileItem = ({ accessKey }: AccessKeyMobileItemProps) => {
  const isUser = useIsUser();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    switch (accessKey.status) {
      case 'deleted':
        return <Badge variant="secondary">Deleted</Badge>;
      case 'revoked':
        return <Badge variant="secondary">Revoked</Badge>;
      default:
        return <Badge variant="outline">Active</Badge>;
    }
  };

  const mobileRow = {
    original: accessKey,
    getValue: (key: string) => (key === 'status' ? accessKey.status : undefined),
  } as unknown as Row<AccessKey>;

  return (
    <AccordionItem value={accessKey.id} className="px-2">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 space-y-1 text-left">
            <p className="text-sm font-medium leading-none flex items-center gap-2">
              <span className="shrink-0">ID:</span>
              <span className="truncate">{truncateId(accessKey.id)}</span>
            </p>
            <div className="text-sm text-muted-foreground">{getStatusBadge()}</div>
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
                {accessKey.status !== 'revoked' && accessKey.status !== 'deleted' && isUser && (
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
  pagination?: PaginationProps;
}

export const AccessKeysMobileList = ({ accessKeys, pagination }: AccessKeysMobileListProps) => {
  // Use the MobileDataTable component to handle pagination
  return (
    <MobileDataTable
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
      ]}
      data={accessKeys}
      renderMobileItem={(accessKey, expandedState) => (
        <AccessKeyMobileItem
          key={accessKey.id}
          accessKey={accessKey as AccessKeysColumns}
          expandedState={expandedState}
        />
      )}
      pagination={pagination}
      manualPagination={!!pagination}
    />
  );
};
