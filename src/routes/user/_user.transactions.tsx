import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';

import { useDebounce } from 'use-debounce';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PrepareTxDialogUser,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  TransactionEditDialog,
  TransactionsTabContent,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { transactionSearchSchema } from '@/routes/admin/_admin.transactions.tsx';
import { transactionsUserQueryOptions } from '@/utils/transactionsUserQueryOptions.tsx';

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
  const [tab, setTab] = useState<string>('all');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);

  const { spvWalletClient } = useSpvWalletClient();
  const { order_by_field, sort_direction } = useSearch({ from: '/user/_user/transactions' });
  // TODO: WIP

  const { data: transactions } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    transactionsUserQueryOptions({
      spvWalletClient: spvWalletClient!,
      blockHeight: Number(debouncedBlockHeight),
      order_by_field,
      sort_direction,
    }),
  );

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
            <TabsTrigger value="prepared">Prepared</TabsTrigger>
          </TabsList>
          <div className="flex">
            <PrepareTxDialogUser />
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} />
          </div>
        </div>
        <TabsContent value="all">
          <TransactionsTabContent transactions={transactions} TxDialog={PrepareTxDialogUser} />
        </TabsContent>
        <TabsContent value="recorded">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              <TransactionsTabContent
                transactions={transactions}
                TxDialog={PrepareTxDialogUser}
                TransactionEditDialog={TransactionEditDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prepared">
          <TransactionsTabContent transactions={transactions} TxDialog={PrepareTxDialogUser} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
