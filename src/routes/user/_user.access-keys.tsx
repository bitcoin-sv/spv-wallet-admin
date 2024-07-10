import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';

import {
  accessKeysColumns,
  DataTable,
  DateRangeFilter,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Toaster,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  AddAccessKeyDialog,
  RevokeKeyDialog,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { addStatusField, getDeletedElements, getRevokedElements } from '@/utils';
import { accessKeysQueryOptions } from '@/utils/accessKeysQueryOptions.tsx';

export const Route = createFileRoute('/user/_user/access-keys')({
  component: AccessKeys,
  preSearchFilters: [
    (search) => ({
      ...search,
    }),
  ],
  validateSearch: z
    .object({
      createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
      order_by_field: z.string().optional().catch('id'),
      revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
      sort_direction: z.string().optional().catch('desc'),
      updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
      page: z.number().optional().catch(1),
      page_size: z.number().optional().catch(10),
    })
    .optional(),

  loaderDeps: ({ search }) => {
    return {
      order_by_field: search?.order_by_field,
      sort_direction: search?.sort_direction,
      createdRange: search?.createdRange,
      updatedRange: search?.updatedRange,
      revokedRange: search?.revokedRange,
      page: search?.page,
      page_size: search?.page_size,
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

  const { order_by_field, sort_direction, createdRange, updatedRange, revokedRange, page, page_size } =
    useSearch({
      from: '/user/_user/access-keys',
    }) || {};

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

  // const accessKeys = useLoaderData({ from: '/user/_user/access-keys' });

  const mappedAccessKeys = addStatusField(accessKeys);
  const revokedKeys = getRevokedElements(mappedAccessKeys);
  const deletedKeys = getDeletedElements(mappedAccessKeys);

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
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Access Keys</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {accessKeys.length > 0 ? (
                <DataTable columns={accessKeysColumns} data={mappedAccessKeys} RevokeKeyDialog={RevokeKeyDialog} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No Access Keys to show.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revoked">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Access Keys</CardTitle>
            </CardHeader>
            <CardContent>
              {revokedKeys.length > 0 ? (
                <DataTable columns={accessKeysColumns} data={revokedKeys} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No Access Keys to show.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deleted">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Access Keys</CardTitle>
            </CardHeader>
            <CardContent>
              {deletedKeys.length > 0 ? (
                <DataTable columns={accessKeysColumns} data={deletedKeys} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No Access Keys to show.</p>
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
