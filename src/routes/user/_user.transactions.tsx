import { CustomErrorComponent, PrepareTxDialogUser, Searchbar, Toaster, TransactionsTabContent } from '@/components';
import { useSearchParam } from '@/hooks/useSearchParam';
import { transactionSearchSchema } from '@/searchSchemas';
import { transactionsUserQueryOptions } from '@/utils/transactionsUserQueryOptions.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/user/_user/transactions')({
  component: Transactions,
  validateSearch: transactionSearchSchema,
  loaderDeps: ({ search: { sortBy, sort, blockHeight, createdRange, updatedRange } }) => ({
    sortBy,
    sort,
    blockHeight,
    createdRange,
    updatedRange,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { queryClient }, deps: { sort, sortBy, blockHeight, createdRange, updatedRange } }) =>
    await queryClient.ensureQueryData(
      transactionsUserQueryOptions({
        sort,
        sortBy,
        blockHeight,
        createdRange,
        updatedRange,
      }),
    ),
});

function Transactions() {
  const { sortBy, sort } = useSearch({ from: '/user/_user/transactions' });
  const [blockHeight, setBlockHeight] = useSearchParam('/user/_user/transactions', 'blockHeight');

  const { data: transactions } = useSuspenseQuery(
    transactionsUserQueryOptions({
      blockHeight: blockHeight,
      sortBy,
      sort,
    }),
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-end mb-2 mt-1">
          <div className="flex">
            <PrepareTxDialogUser />
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
        <TransactionsTabContent
          transactions={transactions.content}
          hasTransactionEditDialog
          hasRecordTransaction
          TxDialog={PrepareTxDialogUser}
        />
        <Toaster position="bottom-center" />
      </div>
    </>
  );
}
