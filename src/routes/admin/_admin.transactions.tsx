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
import { useSearchParam } from '@/hooks/useSearchParam.ts';

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
  const { sortBy, sort } = useSearch({ from: '/admin/_admin/transactions' });
  const [blockHeight, setBlockHeight] = useSearchParam('/admin/_admin/transactions', 'blockHeight');

  const { data: transactions } = useSuspenseQuery(
    transactionsQueryOptions({
      blockHeight,
      sortBy,
      sort,
    }),
  );

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <Searchbar
              filter={blockHeight != null ? `${blockHeight}` : ''}
              setFilter={(value) => {
                const newBlockHeight = parseInt(value);
                setBlockHeight(
                  !isNaN(newBlockHeight) ? newBlockHeight : undefined,
                );
              }}
              placeholder="Search by block height"
            />
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
