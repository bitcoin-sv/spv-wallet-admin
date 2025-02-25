import {
  CustomErrorComponent,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  TransactionsTabContent,
} from '@/components';

import { transactionSearchSchema } from '@/searchSchemas';
import { transactionsQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export const Route = createFileRoute('/admin/_admin/transactions')({
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
      transactionsQueryOptions({
        blockHeight,
        sort,
        sortBy,
        createdRange,
        updatedRange,
      }),
    ),
});

export function Transactions() {
  const [tab, setTab] = useState<string>('all');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);
  const { sortBy, sort } = useSearch({ from: '/admin/_admin/transactions' });

  const { data: transactions } = useSuspenseQuery(
    transactionsQueryOptions({
      blockHeight: debouncedBlockHeight ? Number(debouncedBlockHeight) : undefined,
      sortBy,
      sort,
    }),
  );

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between mt-1">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <Searchbar filter={blockHeight} setFilter={setBlockHeight} placeholder="Search by block height" />
          </div>
        </div>
        <TabsContent value="all">
          <TransactionsTabContent
            transactions={transactions.content}
            hasRecordTransaction={false}
            TxDialog={() => null}
          />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
