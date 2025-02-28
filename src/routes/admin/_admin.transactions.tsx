import { CustomErrorComponent, DateRangeFilter, Searchbar, Toaster, TransactionsTabContent } from '@/components';

import { transactionSearchSchema } from '@/searchSchemas';
import { transactionsQueryOptions } from '@/utils';
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

export const Route = createFileRoute('/admin/_admin/transactions')({
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
      transactionsQueryOptions({
        blockHeight,
        sort,
        sortBy,
        createdRange,
        updatedRange,
        status,
      }),
    ),
});

export function Transactions() {
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);
  const { sortBy, sort, createdRange, updatedRange, status } = useSearch({ from: '/admin/_admin/transactions' });
  const navigate = useNavigate();

  const { data: transactions } = useSuspenseQuery(
    transactionsQueryOptions({
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
    if (key === 'ALL') {
      return 'All';
    }
    return key.charAt(0) + key.slice(1).toLowerCase();
  };

  const currentStatus = status || null;
  const currentStatusKey =
    Object.entries(TRANSACTION_STATUS).find(([, value]) => value === currentStatus)?.[0] || 'ALL';

  return (
    <>
      <div className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
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
          <div className="flex gap-2 -mr-2 mt-1">
            <DateRangeFilter />
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} placeholder="Search by block height" />
          </div>
        </div>
        <div className="mt-4">
          <TransactionsTabContent
            transactions={transactions.content}
            hasRecordTransaction={false}
            TxDialog={() => null}
          />
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
