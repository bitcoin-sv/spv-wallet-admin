import {
  CustomErrorComponent,
  DateRangeFilter,
  PrepareTxDialogUser,
  Searchbar,
  Toaster,
  TransactionsTabContent,
} from '@/components';
import { transactionSearchSchema } from '@/searchSchemas';
import { transactionsUserQueryOptions } from '@/utils/transactionsUserQueryOptions.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { TRANSACTION_STATUS } from '@/constants';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export const Route = createFileRoute('/user/_user/transactions')({
  component: Transactions,
  validateSearch: transactionSearchSchema,
  loaderDeps: ({ search: { sortBy, sort, blockHeight, createdRange, updatedRange, status } }) => ({
    sortBy,
    sort,
    blockHeight,
    createdRange,
    updatedRange,
    status,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({
    context: { queryClient },
    deps: { sort, sortBy, blockHeight, createdRange, updatedRange, status },
  }) =>
    await queryClient.ensureQueryData(
      transactionsUserQueryOptions({
        sort,
        sortBy,
        blockHeight,
        createdRange,
        updatedRange,
        status,
      }),
    ),
});

function Transactions() {
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);
  const { sortBy, sort, createdRange, updatedRange, status } = useSearch({ from: '/user/_user/transactions' });
  const navigate = useNavigate();

  const { data: transactions } = useSuspenseQuery(
    transactionsUserQueryOptions({
      blockHeight: debouncedBlockHeight ? Number(debouncedBlockHeight) : undefined,
      sortBy,
      sort,
      createdRange,
      updatedRange,
      status,
    }),
  );

  const handleStatusChange = (newStatus: string | null) => {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, status: newStatus }),
      replace: true,
    });
  };

  const formatStatusLabel = (key: string) => {
    if (key === 'ALL') return 'All';
    return key.charAt(0) + key.slice(1).toLowerCase();
  };

  const currentStatus = status || null;
  const currentStatusKey =
    Object.entries(TRANSACTION_STATUS).find(([_, value]) => value === currentStatus)?.[0] || 'ALL';

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium ml-1">Status:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {formatStatusLabel(currentStatusKey)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(TRANSACTION_STATUS).map(([key, value]) => (
                    <DropdownMenuItem key={key} onClick={() => handleStatusChange(value)}>
                      {formatStatusLabel(key)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 sm:flex-initial w-full sm:w-auto">
              <PrepareTxDialogUser className="w-full sm:w-auto" />
            </div>
          </div>
          <div className="flex gap-2 -mr-2">
            <DateRangeFilter />
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} placeholder="Search by block height" />
          </div>
        </div>
        <div className="mt-4">
          <TransactionsTabContent
            transactions={transactions.content}
            hasTransactionEditDialog
            hasRecordTransaction
            TxDialog={PrepareTxDialogUser}
          />
        </div>
        <Toaster position="bottom-center" />
      </div>
    </>
  );
}
