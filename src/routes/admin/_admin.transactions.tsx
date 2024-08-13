import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, useSearch } from '@tanstack/react-router';

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
  CustomErrorComponent,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { transactionsQueryOptions } from '@/utils';
import { ErrorResponse } from '@bsv/spv-wallet-js-client';

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
  errorComponent: ({ error }) => {
    if (error instanceof ErrorResponse) {
      return <CustomErrorComponent error={error} />;
    }
    return <ErrorComponent error={error} />;
  },
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
   * @var {boolean} showRecordTransaction
   */
  const showRecordTransaction = false;

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
            {showRecordTransaction && <RecordTxDialogAdmin />}
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
