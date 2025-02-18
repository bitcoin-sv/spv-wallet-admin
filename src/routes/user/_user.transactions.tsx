import { CustomErrorComponent, PrepareTxDialogUser, Searchbar, Toaster, TransactionsTabContent } from '@/components';
import { transactionSearchSchema } from '@/searchSchemas';
import { transactionsUserQueryOptions } from '@/utils/transactionsUserQueryOptions.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';

import { useDebounce } from 'use-debounce';

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
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);
  const { sortBy, sort } = useSearch({ from: '/user/_user/transactions' });

  const { data: transactions } = useSuspenseQuery(
    transactionsUserQueryOptions({
      blockHeight: debouncedBlockHeight ? Number(debouncedBlockHeight) : undefined,
      sortBy,
      sort,
    }),
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-end mb-2">
          <div className="flex">
            <PrepareTxDialogUser />
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} placeholder="Search by block height" />
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
