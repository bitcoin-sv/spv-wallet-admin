import { XPub } from '@bsv/spv-wallet-js-client';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { truncateId } from '@/utils/string';
import { MobileDataTable } from '@/components/DataTable/MobileDataTable';
import { PaginationProps } from '@/components/DataTable/DataTable';

export interface XPubColumnsMobile extends XPub {
  status: string;
  currentBalance: number;
}

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

export interface XPubMobileItemProps {
  xpub: XPubColumnsMobile;
  expandedState?: { expandedItems: string[]; setExpandedItems: (value: string[]) => void };
}

export const XPubMobileItem = ({ xpub }: XPubMobileItemProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  return (
    <AccordionItem value={xpub.id} className="px-2">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center space-x-4 w-full">
          <div className="flex-1 space-y-1 text-left">
            <p className="text-sm font-medium leading-none">ID: {truncateId(xpub.id)}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatBalance(xpub.currentBalance)} sats</span>
              {xpub.status === 'deleted' ? (
                <Badge variant="secondary">Deleted</Badge>
              ) : (
                <Badge variant="outline">Active</Badge>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium">ID:</span>
            <span className="cursor-pointer truncate" onClick={onClickCopy(xpub.id, 'ID')}>
              {xpub.id}
            </span>

            <span className="font-medium">Balance:</span>
            <span>{formatBalance(xpub.currentBalance)} sats</span>

            <span className="font-medium">Created:</span>
            <span>{formatDate(new Date(xpub.createdAt || Date.now()))}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export interface XPubMobileListProps {
  xpubs: XPubColumnsMobile[];
  pagination?: PaginationProps;
  manualPagination?: boolean;
}

export const XPubMobileList = ({ xpubs, pagination, manualPagination = false }: XPubMobileListProps) => {
  // Use MobileDataTable for pagination support
  return (
    <MobileDataTable
      data={xpubs}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
      ]}
      renderMobileItem={(item: XPubColumnsMobile, expandedState) => (
        <XPubMobileItem xpub={item} expandedState={expandedState} />
      )}
      pagination={pagination}
      manualPagination={manualPagination}
    />
  );
};
