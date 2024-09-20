import {
  CustomErrorComponent,
  RecordTxDialogAdmin,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  TransactionsTabContent,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import { transactionSearchSchema } from '@/searchSchemas';
import { transactionsQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

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
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
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

  /**
   * Hiding record transaction button and dialog,
   * until spv-wallet functionality for recording transactions would fulfil users needs and expectations
   * @var {boolean} hasRecordTransaction
   */
  const hasRecordTransaction = false;

  const { data: transactions } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    transactionsQueryOptions({
      spvWalletClient: spvWalletClient!,
      blockHeight: debouncedBlockHeight ? Number(debouncedBlockHeight) : undefined,
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
            {hasRecordTransaction && <RecordTxDialogAdmin />}
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} placeholder="Search by block height" />
          </div>
        </div>
        <TabsContent value="all">
          <TransactionsTabContent
            transactions={transactions}
            hasRecordTransaction={hasRecordTransaction}
            TxDialog={RecordTxDialogAdmin}
          />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
