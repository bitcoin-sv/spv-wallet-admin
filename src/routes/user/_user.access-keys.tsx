import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';

import {
  DateRangeFilter,
  Toaster,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  AddAccessKeyDialog,
  AccessKeysTabContent,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { addStatusField, getDeletedElements, getRevokedElements, accessKeysQueryOptions } from '@/utils';

export const Route = createFileRoute('/user/_user/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    order_by_field: z.string().optional().catch('id'),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sort_direction: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    page: z.number().optional().catch(1),
    page_size: z.number().optional().catch(10),
  }),
  loaderDeps: ({
    search: { order_by_field, sort_direction, createdRange, revokedRange, updatedRange, page, page_size },
  }) => {
    return {
      order_by_field,
      sort_direction,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      page_size,
    };
  },
  loader: async ({
    context: { queryClient, spvWallet },
    deps: { order_by_field, sort_direction, page, page_size, createdRange, revokedRange, updatedRange },
  }) =>
    await queryClient.ensureQueryData(
      accessKeysQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        order_by_field,
        sort_direction,
        createdRange,
        updatedRange,
        revokedRange,
        page,
        page_size,
      }),
    ),
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');

  const navigate = useNavigate({ from: Route.fullPath });

  const { spvWalletClient } = useSpvWalletClient();

  const { order_by_field, sort_direction, createdRange, updatedRange, revokedRange, page, page_size } = useSearch({
    from: '/user/_user/access-keys',
  });

  const { data: accessKeys } = useSuspenseQuery(
    accessKeysQueryOptions({
      spvWalletClient: spvWalletClient!,
      order_by_field,
      sort_direction,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      page_size,
    }),
  );

  const mappedAccessKeys = addStatusField(accessKeys);
  const revokedKeys = getRevokedElements(mappedAccessKeys);
  const deletedKeys = getDeletedElements(mappedAccessKeys);

  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => ({}),
        replace: false,
      });
    }
  }, [tab]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="revoked">Revoked</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <AddAccessKeyDialog className="mr-3" />
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
