import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { CircleX, Search } from 'lucide-react';
import React, { useState } from 'react';

import { useDebounce } from 'use-debounce';

import { z } from 'zod';

import {
  AddXpubDialog,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  xPubsColumns,
  XpubsSkeleton,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import { addStatusField, getDeletedElements, xPubQueryOptions } from '@/utils';

export const Route = createFileRoute('/admin/_admin/xpub')({
  validateSearch: z.object({
    order_by_field: z.string().optional().catch('id'),
    sort_direction: z.string().optional().catch('asc'),
  }),
  component: Xpub,
  pendingComponent: () => <XpubsSkeleton />,
});

export function Xpub() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter] = useDebounce(filter, 200);
  const { order_by_field, sort_direction } = useSearch({ from: '/admin/_admin/xpub' });

  const { data } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    xPubQueryOptions({ spvWalletClient: spvWalletClient!, filterStr: debouncedFilter, order_by_field, sort_direction }),
  );

  const mappedData = addStatusField(data);

  const deletedXpubs = getDeletedElements(mappedData);

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
            <AddXpubDialog className="mr-3" />
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              {filter.length > 0 && (
                <CircleX
                  onClick={() => setFilter('')}
                  className="h-4 w-4 right-2.5 top-3 text-muted-foreground absolute cursor-pointer"
                />
              )}
              <Input
                type="search"
                placeholder="Search by id or balance..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>XPubs</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {data.length > 0 ? (
                <DataTable columns={xPubsColumns} data={mappedData} />
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
                <DataTable columns={xPubsColumns} data={deletedXpubs} />
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
