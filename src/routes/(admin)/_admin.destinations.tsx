import { createFileRoute, useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { z } from 'zod';

import { DataTable } from '@/components/DataTable';
import { DateRangeFilter } from '@/components/DateRangeFIlter/DateRangeFilter.tsx';
import { columns } from '@/components/DestinationsColumns/columns.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { addStatusField, getDeletedElements } from '@/utils';

export const Route = createFileRoute('/(admin)/_admin/destinations')({
  component: Destinations,
  validateSearch: z
    .object({
      lockingScript: z.string().optional().catch(''),
      address: z.string().optional().catch(''),
      order_by_field: z.string().optional().catch('id'),
      sort_direction: z.string().optional().catch('desc'),
      createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
      updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    })
    .optional(),
  loaderDeps: ({ search }) => ({
    lockingScript: search?.lockingScript,
    address: search?.address,
    order_by_field: search?.order_by_field,
    sort_direction: search?.sort_direction,
    createdRange: search?.createdRange,
    updatedRange: search?.updatedRange,
  }),
  loader: async ({
    context,
    deps: { lockingScript, address, order_by_field, sort_direction, createdRange, updatedRange },
  }) =>
    await context.spvWallet.spvWalletClient!.AdminGetDestinations(
      { lockingScript, address, createdRange, updatedRange },
      {},
      { order_by_field, sort_direction },
    ),
});

export function Destinations() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const search = useSearch({ from: '/_admin/destinations' });
  const lockingScript = search?.lockingScript;
  const address = search?.address;

  const [debouncedFilter] = useDebounce(filter, 500);
  const navigate = useNavigate({ from: Route.fullPath });

  const destinations = useLoaderData({ from: '/_admin/destinations' });

  const mappedDestinations = addStatusField(destinations);
  const deletedDests = getDeletedElements(mappedDestinations);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => {
          return {};
        },
        replace: false,
      });
    }
  }, [tab]);

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          lockingScript: filter.startsWith('76') ? filter : undefined,
          address: filter.length > 0 && filter.length <= 34 ? filter : undefined,
        };
      },
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter(lockingScript || address || '');
    navigate({
      search: (old) => {
        return {
          ...old,
          lockingScript: lockingScript || filter.startsWith('76') ? filter : undefined,
          address: address || (filter.length > 0 && filter.length <= 34) ? filter : undefined,
        };
      },
      replace: true,
    });
  }, [lockingScript, address]);

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
                placeholder="Filter by locking script or address..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
            <DateRangeFilter />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {mappedDestinations.length > 0 && <DataTable columns={columns} data={mappedDestinations} />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deleted">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              {deletedDests.length > 0 ? (
                <DataTable columns={columns} data={deletedDests} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No Destinations to show.</p>
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
