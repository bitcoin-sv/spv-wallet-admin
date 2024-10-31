import {
  AccessKeysTabContent,
  AddAccessKeyDialog,
  CustomErrorComponent,
  DateRangeFilter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { accessKeysQueryOptions, addStatusField, getDeletedElements, getRevokedElements } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';

export const Route = createFileRoute('/user/_user/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    orderByField: z.string().optional().catch('id'),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sortDirection: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    page: z.number().optional().catch(1),
    pageSize: z.number().optional().catch(10),
  }),
  loaderDeps: ({
    search: { orderByField, sortDirection, createdRange, revokedRange, updatedRange, page, pageSize },
  }) => {
    return {
      orderByField,
      sortDirection,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      pageSize,
    };
  },
  loader: async ({
    context: { queryClient, spvWallet },
    deps: { orderByField, sortDirection, page, pageSize, createdRange, revokedRange, updatedRange },
  }) =>
    await queryClient.ensureQueryData(
      accessKeysQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        orderByField,
        sortDirection,
        createdRange,
        updatedRange,
        revokedRange,
        page,
        pageSize,
      }),
    ),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');

  const navigate = useNavigate({ from: Route.fullPath });

  const { spvWalletClient } = useSpvWalletClient();

  const { orderByField, sortDirection, createdRange, updatedRange, revokedRange, page, pageSize } = useSearch({
    from: '/user/_user/access-keys',
  });

  const { data: accessKeys } = useSuspenseQuery(
    accessKeysQueryOptions({
      spvWalletClient: spvWalletClient!,
      orderByField,
      sortDirection,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      pageSize,
    }),
  );

  const mappedAccessKeys = addStatusField(accessKeys.content);
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
          <AccessKeysTabContent accessKeys={mappedAccessKeys} hasRevokeKeyDialog />
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
