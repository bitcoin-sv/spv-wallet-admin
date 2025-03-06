import { PaymailAddress } from '@bsv/spv-wallet-js-client';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ViewDialogMobile } from '@/components/ViewDialog/ViewDialogMobile';
import { PaymailDeleteDialogMobile } from '@/components/PaymailDeleteDialog/PaymailDeleteDialogMobile';
import { useIsAdmin } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MobileDataTable } from '@/components/DataTable/MobileDataTable';
import { PaginationProps } from '@/components/DataTable/DataTable';

export interface PaymailColumnsMobile extends Omit<PaymailAddress, 'id'> {
  id: string;
  status: string;
}

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

export interface PaymailMobileItemProps {
  paymail: PaymailColumnsMobile;
  expandedState?: { expandedItems: string[]; setExpandedItems: (value: string[]) => void };
}

export const PaymailMobileItem = ({ paymail }: PaymailMobileItemProps) => {
  const isAdmin = useIsAdmin();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength - 3)}...`;
  };

  return (
    <AccordionItem value={paymail.id} className="px-2">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center w-full gap-4 min-w-0">
          <Avatar className="h-8 w-8 shrink-0">
            {paymail.avatar && <AvatarImage src={paymail.avatar} />}
            <AvatarFallback>{paymail.alias?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1 text-left">
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium leading-none truncate">{truncateText(paymail.alias, 24)}</p>
              <p className="text-xs text-muted-foreground truncate">@{truncateText(paymail.domain, 24)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {paymail.status === 'deleted' ? (
                <Badge variant="secondary">Deleted</Badge>
              ) : paymail.status === 'revoked' ? (
                <Badge variant="secondary">Revoked</Badge>
              ) : (
                <Badge variant="outline">Active</Badge>
              )}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium">ID:</span>
            <span className="cursor-pointer truncate" onClick={onClickCopy(paymail.id, 'ID')}>
              {paymail.id}
            </span>

            {paymail.xpubId && (
              <>
                <span className="font-medium">Xpub ID:</span>
                <span className="cursor-pointer truncate" onClick={onClickCopy(paymail.xpubId, 'Xpub ID')}>
                  {paymail.xpubId}
                </span>
              </>
            )}

            <span className="font-medium">Alias:</span>
            <span className="cursor-pointer break-all" onClick={onClickCopy(paymail.alias, 'Alias')}>
              {paymail.alias}
            </span>

            <span className="font-medium">Domain:</span>
            <span className="cursor-pointer break-all" onClick={onClickCopy(paymail.domain, 'Domain')}>
              {paymail.domain}
            </span>

            {paymail.publicName && (
              <>
                <span className="font-medium">Public Name:</span>
                <span>{paymail.publicName}</span>
              </>
            )}

            <span className="font-medium">Created:</span>
            <span>{formatDate(new Date(paymail.createdAt))}</span>
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
                <ViewDialogMobile data={paymail} />
                {isAdmin && paymail.deletedAt == null && <PaymailDeleteDialogMobile id={paymail.id} />}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export interface PaymailsMobileListProps {
  paymails: PaymailColumnsMobile[];
  pagination?: PaginationProps;
  manualPagination?: boolean;
}

export const PaymailsMobileList = ({ paymails, pagination, manualPagination = false }: PaymailsMobileListProps) => {
  return (
    <MobileDataTable
      data={paymails}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
      ]}
      renderMobileItem={(item: PaymailColumnsMobile, expandedState) => (
        <PaymailMobileItem paymail={item} expandedState={expandedState} />
      )}
      pagination={pagination}
      manualPagination={manualPagination}
    />
  );
};
