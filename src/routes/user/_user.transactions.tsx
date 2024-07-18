import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { CircleX, Search } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';
// import { RecordTxDialogAdmin } from 'src/components/RecordTxDialogAdmin';
import { useDebounce } from 'use-debounce';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  PrepareTxDialogUser,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  TransactionEditDialog,
} from '@/components';
import { columns } from '@/components/TransactionsColumns/columns.tsx';
import { useSpvWalletClient } from '@/contexts';
import { transactionsSearchSchema } from '@/routes/admin/_admin.transactions.tsx';
import { transactionsUserQueryOptions } from '@/utils/transactionsUserQueryOptions.tsx';

export const Route = createFileRoute('/user/_user/transactions')({
  component: Transactions,
  validateSearch: transactionsSearchSchema,
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

  useEffect(() => {
    (async () => {
      const res = await spvWalletClient?.GetTransactions({}, {}, {});
      console.log('1', res);
    })();
  }, []);

  const { data: transactions } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    transactionsUserQueryOptions({
      spvWalletClient: spvWalletClient!,
      blockHeight: Number(debouncedBlockHeight),
      order_by_field,
      sort_direction,
    }),
  );

  const handleBlockHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(+event.target.value)) {
      toast.error('Block Height should be a number');
      return;
    }
    setBlockHeight(event.target.value);
  };
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
            {/*<RecordTxDialogAdmin />*/}
            <PrepareTxDialogUser />
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              {blockHeight.length > 0 && (
                <CircleX
                  onClick={() => setBlockHeight('')}
                  className="h-4 w-4 right-2.5 top-3 text-muted-foreground absolute cursor-pointer"
                />
              )}
              <Input
                type="search"
                placeholder="Search by block height..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={blockHeight}
                onChange={handleBlockHeightChange}
              />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {transactions.length > 0 ? (
                <DataTable columns={columns} data={transactions} EditDialog={TransactionEditDialog} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-2">You can prepare Transaction here.</p>
                  <PrepareTxDialogUser />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recorded">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {transactions.length > 0 ? (
                <DataTable columns={columns} data={transactions} EditDialog={TransactionEditDialog} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-2">You can prepare Transaction here.</p>
                  <PrepareTxDialogUser />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prepared">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {transactions.length > 0 ? (
                <DataTable columns={columns} data={transactions} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-2">You can prepare Transaction here.</p>
                  <PrepareTxDialogUser />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
