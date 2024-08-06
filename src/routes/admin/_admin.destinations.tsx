import { createFileRoute, ErrorComponent, useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { z } from 'zod';

import {
  CustomErrorComponent,
  DateRangeFilter,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { DestinationsTabContent } from '@/components/DestinationsTabContent';
import { addStatusField, getAddress, getDeletedElements, getLockingScript } from '@/utils';
import { ErrorResponse } from '@bsv/spv-wallet-js-client';

// TODO [react-refresh]: only 1 export is allowed
// eslint-disable-next-line  react-refresh/only-export-components
export const destinationSearchSchema = z.object({
  lockingScript: z.string().optional().catch(''),
  address: z.string().optional().catch(''),
  order_by_field: z.string().optional().catch('id'),
  sort_direction: z.string().optional().catch('desc'),
  createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
});

export const Route = createFileRoute('/admin/_admin/destinations')({
  component: Destinations,
  errorComponent: ({ error }) => {
    if (error instanceof ErrorResponse) {
      return <CustomErrorComponent error={error} />;
    }
    return <ErrorComponent error={error} />;
  },
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
    context: {
      spvWallet: { spvWalletClient },
    },
    deps: { lockingScript, address, order_by_field, sort_direction, createdRange, updatedRange },
  }) =>
    await spvWalletClient!.AdminGetDestinations(
      { lockingScript, address, createdRange, updatedRange },
      {},
      { order_by_field, sort_direction },
    ),
});

export function Destinations() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { lockingScript, address } = useSearch({ from: '/admin/_admin/destinations' });

  const [debouncedFilter] = useDebounce(filter, 200);
  const navigate = useNavigate({ from: Route.fullPath });

  const destinations = useLoaderData({ from: '/admin/_admin/destinations' });

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
      search: (old) => ({
        ...old,
        lockingScript: getLockingScript(filter),
        address: getAddress(filter),
      }),
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter(lockingScript || address || '');
    navigate({
      search: (old) => ({
        ...old,
        lockingScript: lockingScript || getLockingScript(filter),
        address: address || getAddress(filter),
      }),
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
            <Searchbar filter={filter} setFilter={setFilter} />
            <DateRangeFilter />
          </div>
        </div>
        <TabsContent value="all">
          <DestinationsTabContent destinations={mappedDestinations} />
        </TabsContent>
        <TabsContent value="deleted">
          <DestinationsTabContent destinations={deletedDests} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
