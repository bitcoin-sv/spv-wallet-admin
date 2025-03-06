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
import { useCallback, useMemo } from 'react';

export const Route = createFileRoute('/user/_user/transactions')({
  component: Transactions,
  validateSearch: transactionSearchSchema,
  loaderDeps: ({ search: { sortBy, sort, blockHeight, createdRange, updatedRange, status, page, size } }) => ({
    sortBy,
    sort,
    blockHeight,
    createdRange,
    updatedRange,
    status,
    page,
    size,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({
    context: { queryClient },
    deps: { sort, sortBy, blockHeight, createdRange, updatedRange, status, page, size },
  }) =>
    await queryClient.ensureQueryData(
      transactionsUserQueryOptions({
        sort,
        sortBy,
        blockHeight,
        createdRange,
        updatedRange,
        status,
        page,
        size,
      }),
    ),
});

function Transactions() {
  const {
    sortBy,
    sort,
    createdRange,
    updatedRange,
    status,
    page = 1,
    size = 10,
  } = useSearch({
    from: '/user/_user/transactions',
  });
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
      page,
      size,
    }),
  );

  // Memoize current status key lookup based on status from URL
  const currentStatusKey = useMemo(() => {
    const currentStatus = status || null;
    return Object.entries(TRANSACTION_STATUS).find(([, value]) => value === currentStatus)?.[0] || 'ALL';
  }, [status]);

  // Pagination handlers memoized using useCallback
  const handlePageChange = useCallback(
    (newPage: number) => {
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, page: newPage + 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, size: newSize, page: 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <>
      <div className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Status Dropdown and Tx Dialog */}
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
                  <DropdownMenuItem
                    key={key}
                    onClick={() =>
                      navigate({
                        to: '.',
                        search: (prev) => ({ ...prev, status: value }),
                        replace: true,
                      })
                    }
                  >
                    {formatStatusLabel(key as keyof TransactionStatusType)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <PrepareTxDialogUser className="ml-0 sm:ml-2 mt-2 sm:mt-0 w-full sm:w-auto" />
          </div>
          {/* Date Range Filter and Block Height Search */}
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
        {/* Transactions Content */}
        <div className="mt-4">
          <TransactionsTabContent
            transactions={transactions.content}
            hasTransactionEditDialog
            hasRecordTransaction
            TxDialog={PrepareTxDialogUser}
            pagination={{
              currentPage: Number(page) - 1,
              pageSize: Number(size),
              totalPages: transactions.page.totalPages,
              totalElements: transactions.page.totalElements,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}

export { Transactions };
