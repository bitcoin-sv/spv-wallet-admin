import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';

import { CircleX, Search } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { z } from 'zod';

import { DataTable } from '@/components/DataTable';
import { RecordTxDialog } from '@/components/RecordTxDialog';
import { columns } from '@/components/TransactionsColumns/columns.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useSpvWalletClient } from '@/contexts';
import { transactionsQueryOptions } from '@/utils/transactionsQueryOptions.tsx';

export const Route = createFileRoute('/admin/_admin/transactions')({
  component: Transactions,
  validateSearch: z.object({
    order_by_field: z.string().optional().catch('id'),
    sort_direction: z.string().optional().catch('desc'),
    blockHeight: z.number().optional().catch(undefined),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  }),
  loaderDeps: ({ search }) => ({
    order_by_field: search?.order_by_field,
    sort_direction: search?.sort_direction,
    blockHeight: search?.blockHeight,
    createdRange: search?.createdRange,
    updatedRange: search?.updatedRange,
  }),
  loader: async ({ context: { queryClient, spvWallet }, deps }) => {
    const { sort_direction, order_by_field, blockHeight, createdRange, updatedRange } = deps;
    return await queryClient.ensureQueryData(
      transactionsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        sort_direction,
        order_by_field,
        blockHeight,
        createdRange,
        updatedRange,
      }),
    );
  },
});

export function Transactions() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState<string>('all');
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [debouncedBlockHeight] = useDebounce(blockHeight, 200);
  const { order_by_field, sort_direction } = useSearch({ from: '/admin/_admin/transactions' });

  const { data } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    transactionsQueryOptions({
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

  // TODO: Add server pagination for xpubs when search and count will be merged

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <RecordTxDialog />
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
                placeholder="Search by bloch height..."
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
              {data.length > 0 ? (
                <DataTable columns={columns} data={data} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-2">You can record Transaction here.</p>
                  <RecordTxDialog />
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
