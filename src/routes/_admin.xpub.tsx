import { createFileRoute, useSearch } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { AddXpubDialog } from '@/components/AddXpubDialog/AddXpubDialog.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { DataTable } from '@/components/XPubTable/DataTable.tsx';
import { columns } from '@/components/XPubTable/columns.tsx';
import { XpubExtended } from '@/interfaces';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSpvWalletClient } from '@/contexts';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { useDebounce } from 'use-debounce';
import { xPubQueryOptions } from '@/utils/queryOptions.tsx';
import { z } from 'zod';
import { XpubsSkeleton } from '@/components/XpubsSkeleton/XpubsSkeleton.tsx';

const xPubSearchSchema = z.object({
  order_by_field: z.string().optional().catch('id'),
  sort_direction: z.string().optional().catch('asc'),
});

export const Route = createFileRoute('/_admin/xpub')({
  validateSearch: xPubSearchSchema,
  component: Xpub,
  pendingComponent: () => <XpubsSkeleton />,
});

export function Xpub() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter] = useDebounce(filter, 200);
  const { order_by_field, sort_direction } = useSearch({ from: '/_admin/xpub' });

  const { data } = useSuspenseQuery(
    // // At this point, spvWalletClient is defined; using non-null assertion.
    xPubQueryOptions({ spvWalletClient: spvWalletClient!, filterStr: debouncedFilter, order_by_field, sort_direction }),
  );

  const mappedData: XpubExtended[] = data.map((xpub) => {
    return {
      ...xpub,
      status: xpub.deleted_at === null ? 'active' : 'deleted',
    };
  });

  const deletedXpubs = mappedData.filter((xpub) => xpub.status === 'deleted');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  // TODO: Add server pagination for xpubs when search and count will be merged

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <div className="relative flex-1 md:grow-0 mr-6">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Filter by id or balance..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
            <AddXpubDialog />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>XPubs</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {data.length > 0 ? (
                <DataTable columns={columns} data={mappedData} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no xPubs</h3>
                  <p className="text-sm text-muted-foreground">You can add xPub here.</p>
                  <AddXpubDialog />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deleted">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>XPubs</CardTitle>
            </CardHeader>
            <CardContent>
              {deletedXpubs.length > 0 ? (
                <DataTable columns={columns} data={deletedXpubs} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No xPubs to show.</p>
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
