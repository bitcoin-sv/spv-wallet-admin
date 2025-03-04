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

import { accessKeysAdminQueryOptions, addStatusField, getDeletedElements, getRevokedElements } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';

export const Route = createFileRoute('/admin/_admin/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sortBy: z.string().optional().catch('id'),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sort: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    xpubId: z.string().optional().catch(''),
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loaderDeps: ({ search: { sortBy, sort, xpubId, createdRange, updatedRange, revokedRange } }) => ({
    sortBy,
    sort,
    xpubId,
    createdRange,
    updatedRange,
    revokedRange,
  }),
  loader: async ({
                   context: { queryClient },
                   deps: { sortBy, sort, xpubId, createdRange, revokedRange, updatedRange },
                 }) => {
    await queryClient.ensureQueryData(
      accessKeysAdminQueryOptions({
        xpubId,
        createdRange,
        updatedRange,
        revokedRange,
        sort,
        sortBy,
      }),
    );
  },
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');

  const navigate = useNavigate({ from: Route.fullPath });
  const { sortBy, sort, createdRange, updatedRange, revokedRange } = useSearch({
    from: '/admin/_admin/access-keys',
  });
  const [xpubId, setXPubId] = useSearchParam('/admin/_admin/access-keys', 'xpubId');

  const { data: accessKeys } = useSuspenseQuery(
    accessKeysAdminQueryOptions({
      xpubId,
      sortBy,
      sort,
      createdRange,
      updatedRange,
      revokedRange,
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
      }).catch(console.error);
    }
  }, [tab]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          {/* Desktop version */}
          <TabsList
            className="hidden sm:flex h-9 items-center justify-start rounded-lg p-1 text-muted-foreground bg-muted">
            <TabsTrigger
              value="all"
              className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="revoked"
              className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
            >
              Revoked
            </TabsTrigger>
            <TabsTrigger
              value="deleted"
              className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
            >
              Deleted
            </TabsTrigger>
          </TabsList>

          {/* Mobile version */}
          <TabsList
            className="sm:hidden w-full flex justify-between items-center rounded-lg p-1 text-muted-foreground bg-muted">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-3 py-2 text-sm"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="revoked"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-3 py-2 text-sm"
            >
              Revoked
            </TabsTrigger>
            <TabsTrigger
              value="deleted"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-3 py-2 text-sm"
            >
              Deleted
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center p-1">
            <Searchbar filter={xpubId ?? ''} setFilter={setXPubId} placeholder="Search by xpubID" />
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
