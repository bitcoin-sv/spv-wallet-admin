import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import {
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  TransactionsTabContent,
  RecordTxDialogAdmin,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { transactionsQueryOptions } from '@/utils';
import { transactionSearchSchema } from '@/searchSchemas';

export const Route = createFileRoute('/admin/_admin/transactions')({
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
    await queryClient.ensureQueryData(
      transactionsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        sort_direction,
        order_by_field,
        blockHeight,
        createdRange,
        updatedRange,
      }),
    ),
});

export function Transactions() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState<string>('all');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);
  const { order_by_field, sort_direction } = useSearch({ from: '/admin/_admin/transactions' });

  const { data: transactions } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    transactionsQueryOptions({
      spvWalletClient: spvWalletClient!,
      blockHeight: Number(debouncedBlockHeight),
      order_by_field,
      sort_direction,
    }),
  );

  // TODO: Add server pagination for xpubs when search and count will be merged

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <RecordTxDialogAdmin />
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} />
          </div>
        </div>
        <TabsContent value="all">
          <TransactionsTabContent transactions={transactions} TxDialog={RecordTxDialogAdmin} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
