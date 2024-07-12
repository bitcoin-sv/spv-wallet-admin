import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import {
  AddDestinationDialog,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DateRangeFilter,
  DestinationEditDialog,
  destinationsColumns,
  NoRecordsText,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { destinationSearchSchema } from '@/routes/admin/_admin.destinations.tsx';
import { addStatusField, getDeletedElements } from '@/utils';
import { destinationsQueryOptions } from '@/utils/destinationsQueryOptions.tsx';

export const Route = createFileRoute('/user/_user/destinations')({
  component: Destinations,
  validateSearch: destinationSearchSchema,
  loaderDeps: ({ search: { lockingScript, address, order_by_field, sort_direction, createdRange, updatedRange } }) => ({
    lockingScript,
    address,
    order_by_field,
    sort_direction,
    createdRange,
    updatedRange,
  }),
  loader: async ({
    context: { queryClient, spvWallet },
    deps: { lockingScript, address, order_by_field, sort_direction, createdRange, updatedRange },
  }) =>
    await queryClient.ensureQueryData(
      destinationsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        lockingScript,
        address,
        order_by_field,
        sort_direction,
        createdRange,
        updatedRange,
      }),
    ),
});

export function Destinations() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const search = useSearch({ from: '/user/_user/destinations' });
  const lockingScript = search?.lockingScript;
  const address = search?.address;
  const { spvWalletClient } = useSpvWalletClient();
  const { order_by_field, sort_direction, createdRange, updatedRange } = useSearch({
    from: '/user/_user/destinations',
  });

  const [debouncedFilter] = useDebounce(filter, 200);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: destinations } = useSuspenseQuery(
    destinationsQueryOptions({
      spvWalletClient: spvWalletClient!,
      lockingScript,
      address,
      order_by_field,
      sort_direction,
      createdRange,
      updatedRange,
    }),
  );

  const mappedDestinations = addStatusField(destinations);
  const deletedDests = getDeletedElements(mappedDestinations);

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
            <AddDestinationDialog className="mr-3" />
            <Searchbar filter={filter} setFilter={setFilter} />
            <DateRangeFilter />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {mappedDestinations.length > 0 ? (
                <DataTable columns={destinationsColumns} data={mappedDestinations} EditDialog={DestinationEditDialog} />
              ) : (
                <NoRecordsText message="No Destinations to show." />
              )}
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
                <DataTable columns={destinationsColumns} data={deletedDests} />
              ) : (
                <NoRecordsText message="No Destinations to show." />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
