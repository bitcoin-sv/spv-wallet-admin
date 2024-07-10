import { createFileRoute, useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';

import { CircleX, Search } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';

import { z } from 'zod';

import {
  accessKeysColumns,
  DataTable,
  DateRangeFilter,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Toaster,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components';

import { addStatusField, getDeletedElements, getRevokedElements } from '@/utils';

export const Route = createFileRoute('/admin/_admin/access-keys')({
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
      xpubId: z.string().optional().catch(''),
    })
    .optional(),

  loaderDeps: ({ search }) => {
    return {
      order_by_field: search?.order_by_field,
      sort_direction: search?.sort_direction,
      xpubId: search?.xpubId,
      createdRange: search?.createdRange,
      updatedRange: search?.updatedRange,
      revokedRange: search?.revokedRange,
    };
  },
  loader: async ({
    context,
    deps: { order_by_field, sort_direction, xpubId, createdRange, revokedRange, updatedRange },
  }) =>
    await context.spvWallet.spvWalletClient!.AdminGetAccessKeys(
      { xpubId, createdRange, updatedRange, revokedRange },
      {},
      { order_by_field, sort_direction },
    ),
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const search = useSearch({ from: '/admin/_admin/access-keys' });
  const xpubId = search?.xpubId;

  const [debouncedFilter] = useDebounce(filter, 500);
  const navigate = useNavigate({ from: Route.fullPath });

  const accessKeys = useLoaderData({ from: '/admin/_admin/access-keys' });

  const mappedAccessKeys = addStatusField(accessKeys);
  const revokedKeys = getRevokedElements(mappedAccessKeys);
  const deletedKeys = getDeletedElements(mappedAccessKeys);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          xpubId: filter || undefined,
        };
      },
      replace: true,
    });
  }, [debouncedFilter]);

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
    setFilter(xpubId || '');
    navigate({
      search: (old) => {
        return {
          ...old,
          xpubId,
        };
      },
      replace: true,
    });
  }, [xpubId]);

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
            <div className="relative flex-1 md:grow-0 mr-3">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              {filter.length > 0 && (
                <CircleX
                  onClick={() => setFilter('')}
                  className="h-4 w-4 right-2.5 top-3 text-muted-foreground absolute cursor-pointer"
                />
              )}
              <Input
                type="search"
                placeholder="Search by xpub id..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
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
                <DataTable columns={accessKeysColumns} data={mappedAccessKeys} />
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
