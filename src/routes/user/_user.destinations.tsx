import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import {
  AddDestinationDialog,
  DateRangeFilter,
  DestinationEditDialog,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { DestinationsTabContent } from '@/components/DestinationsTabContent';
import { useSpvWalletClient } from '@/contexts';
import { addStatusField, getAddress, getDeletedElements, getLockingScript } from '@/utils';
import { destinationsQueryOptions } from '@/utils/destinationsQueryOptions.tsx';
import { destinationSearchSchema } from '@/searchSchemas';

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

  const { lockingScript, address } = useSearch({ from: '/user/_user/destinations' });
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
        search: () => ({}),
        replace: false,
      });
    }
  }, [tab]);

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          lockingScript: getLockingScript(filter),
          address: getAddress(filter),
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
          lockingScript: getLockingScript(filter),
          address: address || getAddress(filter),
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
          <DestinationsTabContent destinations={mappedDestinations} DestinationEditDialog={DestinationEditDialog} />
        </TabsContent>
        <TabsContent value="deleted">
          <DestinationsTabContent destinations={deletedDests} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
