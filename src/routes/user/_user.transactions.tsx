import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';

import { useDebounce } from 'use-debounce';

import { PrepareTxDialogUser, Searchbar, Toaster, TransactionEditDialog, TransactionsTabContent } from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { transactionsUserQueryOptions } from '@/utils/transactionsUserQueryOptions.tsx';
import { transactionSearchSchema } from '@/searchSchemas';

export const Route = createFileRoute('/user/_user/transactions')({
  component: Transactions,
  validateSearch: transactionSearchSchema,
  loaderDeps: ({ search: { order_by_field, sort_direction, blockHeight, createdRange, updatedRange } }) => ({
    order_by_field,
    sort_direction,
    blockHeight,
    createdRange,
    updatedRange,
  }),
  loader: async ({
    context: { queryClient, spvWallet },
    deps: { sort_direction, order_by_field, blockHeight, createdRange, updatedRange },
  }) =>
    //TODO: add getDraftTransactions request
    await queryClient.ensureQueryData(
      transactionsUserQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        sort_direction,
        order_by_field,
        blockHeight,
        createdRange,
        updatedRange,
      }),
    ),
});

function Transactions() {
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);

  const { spvWalletClient } = useSpvWalletClient();
  const { order_by_field, sort_direction } = useSearch({ from: '/user/_user/transactions' });

  const { data: transactions } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    transactionsUserQueryOptions({
      spvWalletClient: spvWalletClient!,
      blockHeight: debouncedBlockHeight ? Number(debouncedBlockHeight) : undefined,
      order_by_field,
      sort_direction,
    }),
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-end mb-2">
          <div className="flex">
            <PrepareTxDialogUser />
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} />
          </div>
        </div>
        <TransactionsTabContent
          transactions={transactions}
          TransactionEditDialog={TransactionEditDialog}
          TxDialog={PrepareTxDialogUser}
        />
        <Toaster position="bottom-center" />
      </div>
    </>
  );
}
