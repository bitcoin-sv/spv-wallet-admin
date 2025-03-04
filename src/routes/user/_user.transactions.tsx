import {
  CustomErrorComponent,
  DateRangeFilter,
  PrepareTxDialogUser,
  Searchbar,
  Toaster,
  TransactionsTabContent,
} from '@/components';
import { transactionSearchSchema } from '@/searchSchemas';
import { formatStatusLabel } from '@/utils';
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
import { TRANSACTION_STATUS, TransactionStatusType } from '@/constants';

import { useSearchParam } from '@/hooks/useSearchParam.ts';

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
  const { sortBy, sort, createdRange, updatedRange, status } = useSearch({ from: '/user/_user/transactions' });
  const [blockHeight, setBlockHeight] = useSearchParam('/user/_user/transactions', 'blockHeight');
  const navigate = useNavigate();

  const { data: transactions } = useSuspenseQuery(
    transactionsUserQueryOptions({
      blockHeight,
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

  const currentStatus = status || null;
  const currentStatusKey =
    Object.entries(TRANSACTION_STATUS).find(([, value]) => value === currentStatus)?.[0] || 'ALL';

  return (
    <>
      <div className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium ml-1">Status:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {formatStatusLabel(currentStatusKey as keyof TransactionStatusType)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(TRANSACTION_STATUS).map(([key, value]) => (
                  <DropdownMenuItem key={key} onClick={() => handleStatusChange(value)}>
                    {formatStatusLabel(key as keyof TransactionStatusType)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <PrepareTxDialogUser className="ml-0 sm:ml-2 mt-2 sm:mt-0 w-full sm:w-auto" />
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <DateRangeFilter />
            <Searchbar
              filter={blockHeight != null ? `${blockHeight}` : ''}
              setFilter={(value) => {
                const newBlockHeight = parseInt(value);
                setBlockHeight(!isNaN(newBlockHeight) ? newBlockHeight : undefined);
              }}
              placeholder="Search by block height"
            />
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
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
