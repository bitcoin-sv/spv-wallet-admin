import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { useState } from 'react';
import { truncateId } from '@/utils/string';
import { createToggleExpandAll } from '@/utils/expandUtils';
import { renderTransactionStatusBadge } from '@/utils';
import { TransactionExtended } from '@/interfaces/transaction';
import { TransactionStatusValue } from '@/constants';

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

interface TransactionMobileItemProps {
  transaction: TransactionExtended;
}

export const TransactionMobileItem = ({ transaction }: TransactionMobileItemProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStatusBadge = (status: TransactionStatusValue) => {
    return renderTransactionStatusBadge(status);
  };

  return (
    <AccordionItem value={transaction.id} className="px-2">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 space-y-1 text-left">
            <p className="text-sm font-medium leading-none flex items-center gap-2">
              <span className="shrink-0">ID:</span>
              <span className="truncate">{truncateId(transaction.id)}</span>
            </p>
            <p className="text-sm text-muted-foreground">{renderStatusBadge(transaction.status)}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium">ID:</span>
            <span className="cursor-pointer truncate" onClick={onClickCopy(transaction.id, 'ID')}>
              {transaction.id}
            </span>

            <span className="font-medium">Block Height:</span>
            <span>{transaction.blockHeight || 'N/A'}</span>

            <span className="font-medium">Status:</span>
            <span>{renderStatusBadge(transaction.status)}</span>

            <span className="font-medium">Created:</span>
            <span>{formatDate(new Date(transaction.createdAt))}</span>
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
                  <ViewDialogMobile data={transaction} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export interface TransactionsMobileListProps {
  transactions: TransactionExtended[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export const TransactionsMobileList = ({ transactions, value, onValueChange }: TransactionsMobileListProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(value || []);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const toggleExpandAll = () => {
    createToggleExpandAll(
      transactions,
      isAllExpanded,
      (ids) => {
        setExpandedItems(ids);
        onValueChange?.(ids);
      },
      setIsAllExpanded,
      (transaction) => transaction.id,
    );
  };

  const handleValueChange = (newValue: string[]) => {
    setExpandedItems(newValue);
    onValueChange?.(newValue);
    setIsAllExpanded(newValue.length === transactions.length);
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
          {transactions.map((transaction) => (
            <TransactionMobileItem key={transaction.id} transaction={transaction} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};
