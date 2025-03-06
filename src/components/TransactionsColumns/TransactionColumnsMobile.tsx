import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { truncateId } from '@/utils/string';
import { renderTransactionStatusBadge } from '@/utils';
import { TransactionExtended } from '@/interfaces/transaction';
import { TransactionStatusValue } from '@/constants';
import { MobileDataTable } from '@/components/DataTable/MobileDataTable';
import { PaginationProps } from '@/components/DataTable/DataTable';

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

interface TransactionMobileItemProps {
  transaction: TransactionExtended;
  expandedState?: { expandedItems: string[]; setExpandedItems: (value: string[]) => void };
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
            <div className="text-sm text-muted-foreground">{renderStatusBadge(transaction.status)}</div>
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
  pagination?: PaginationProps;
  manualPagination?: boolean;
}

export const TransactionsMobileList = ({
  transactions,
  pagination,
  manualPagination = false,
}: TransactionsMobileListProps) => {
  // Use MobileDataTable for pagination support
  return (
    <MobileDataTable
      data={transactions}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
      ]}
      renderMobileItem={(item: TransactionExtended, expandedState) => (
        <TransactionMobileItem transaction={item} expandedState={expandedState} />
      )}
      pagination={pagination}
      manualPagination={manualPagination}
    />
  );
};
