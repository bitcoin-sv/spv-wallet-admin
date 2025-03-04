import { PaymailAddress } from '@bsv/spv-wallet-js-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ViewDialogMobile } from '@/components/ViewDialog/ViewDialogMobile';
import { PaymailDeleteDialogMobile } from '@/components/PaymailDeleteDialog/PaymailDeleteDialogMobile';
import { isAdmin } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { createToggleExpandAll } from '@/utils/expandUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
}

export const PaymailMobileItem = ({ paymail }: PaymailMobileItemProps) => {
  const isAdminUser = isAdmin();
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
                {isAdminUser && paymail.deletedAt == null && <PaymailDeleteDialogMobile id={paymail.id} />}
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
}

export const PaymailsMobileList = ({ paymails }: PaymailsMobileListProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const toggleExpandAll = () => {
    createToggleExpandAll(paymails, isAllExpanded, setExpandedItems, setIsAllExpanded, (paymail) => paymail.id);
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
          {paymails.map((paymail) => (
            <PaymailMobileItem key={paymail.id} paymail={paymail} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};
