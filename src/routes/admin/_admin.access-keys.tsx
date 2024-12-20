import {
  AccessKeysTabContent,
  CustomErrorComponent,
  DateRangeFilter,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import {
  accessKeysAdminQueryOptions,
  addStatusField,
  getDeletedElements,
  getRevokedElements,
  mapOldAccessKeysToAccessKeys,
} from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';

import { z } from 'zod';

export const Route = createFileRoute('/admin/_admin/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    order_by_field: z.string().optional().catch('id'),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sort_direction: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    xpubId: z.string().optional().catch(''),
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loaderDeps: ({ search: { order_by_field, sort_direction, xpubId, createdRange, updatedRange, revokedRange } }) => ({
    order_by_field,
    sort_direction,
    xpubId,
    createdRange,
    updatedRange,
    revokedRange,
  }),
  loader: async ({
    context: {
      spvWallet: { spvWalletClient },
      queryClient,
    },
    deps: { order_by_field, sort_direction, xpubId, createdRange, revokedRange, updatedRange },
  }) => {
    await queryClient.ensureQueryData(
      accessKeysAdminQueryOptions({
        spvWalletClient: spvWalletClient!,
        xpubId,
        createdRange,
        updatedRange,
        revokedRange,
        sort_direction,
        order_by_field,
      }),
    );
  },
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { xpubId, order_by_field, sort_direction, createdRange, updatedRange, revokedRange } = useSearch({
    from: '/admin/_admin/access-keys',
  });

  const [debouncedFilter] = useDebounce(filter, 500);
  const navigate = useNavigate({ from: Route.fullPath });

  const { spvWalletClient } = useSpvWalletClient();

  const { data: accessKeys } = useSuspenseQuery(
    accessKeysAdminQueryOptions({
      spvWalletClient: spvWalletClient!,
      xpubId,
      order_by_field,
      sort_direction,
      createdRange,
      updatedRange,
      revokedRange,
    }),
  );

  const accessKeysFromOldAccessKeys = mapOldAccessKeysToAccessKeys(accessKeys);
  const mappedAccessKeys = addStatusField(accessKeysFromOldAccessKeys);
  const revokedKeys = getRevokedElements(mappedAccessKeys);
  const deletedKeys = getDeletedElements(mappedAccessKeys);

  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        xpubId: filter || undefined,
      }),
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => ({}),
        replace: false,
      });
    }
  }, [tab]);

  useEffect(() => {
    setFilter(xpubId || '');
    navigate({
      search: (old) => ({
        ...old,
        xpubId,
      }),
      replace: true,
    });
  }, [xpubId]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="revoked">Revoked</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by xpubID" />
            <DateRangeFilter withRevokedRange />
          </div>
        </div>
        <TabsContent value="all">
          <AccessKeysTabContent accessKeys={mappedAccessKeys} />
        </TabsContent>
        <TabsContent value="revoked">
          <AccessKeysTabContent accessKeys={revokedKeys} />
        </TabsContent>
        <TabsContent value="deleted">
          <AccessKeysTabContent accessKeys={deletedKeys} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
