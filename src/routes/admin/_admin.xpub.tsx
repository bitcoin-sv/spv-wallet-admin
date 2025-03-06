import {
  AddXpubDialog,
  CustomErrorComponent,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  XpubsSkeleton,
  XpubsTabContent,
} from '@/components';
import { addStatusField, xPubQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useMemo, useCallback } from 'react';
import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';

export const Route = createFileRoute('/admin/_admin/xpub')({
  component: Xpub,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('asc'),
    id: z.string().optional(),
    page: z.coerce.number().optional().default(1).catch(1),
    size: z.coerce.number().optional().default(10).catch(10),
  }),
  loaderDeps: ({ search: { sortBy, sort, id, page, size } }) => ({
    sortBy,
    sort,
    id,
    page,
    size,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { queryClient }, deps: { sortBy, sort, id, page, size } }) =>
    await queryClient.ensureQueryData(
      xPubQueryOptions({
        id,
        sort,
        sortBy,
        page,
        size,
      }),
    ),
  pendingComponent: () => <XpubsSkeleton />,
});

export function Xpub() {
  const [tab, setTab] = useState<string>('all');
  const { sortBy, sort, page = 1, size = 10 } = useSearch({ from: '/admin/_admin/xpub' });
  const [id, setID] = useSearchParam('/admin/_admin/xpub', 'id');
  const navigate = useNavigate();

  const { data: xpubs } = useSuspenseQuery(
    xPubQueryOptions({
      id,
      sortBy,
      sort,
      page,
      size,
    }),
  );

  // Memoize the transformed xpubs data
  const mappedXpubs = useMemo(() => addStatusField(xpubs.content), [xpubs.content]);

  // Memoize pagination handlers to avoid unnecessary re-renders
  const handlePageChange = useCallback(
    (newPage: number) => {
      // Convert from 0-indexed (UI) to 1-indexed (API)
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, page: newPage + 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, size: newSize, page: 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between mt-1">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <AddXpubDialog className="mr-3" />
            <Searchbar filter={id ?? ''} setFilter={setID} placeholder="Search by ID" />
          </div>
        </div>
        <TabsContent value="all">
          <XpubsTabContent
            xpubs={mappedXpubs}
            pagination={{
              currentPage: Number(page) - 1, // Convert API's 1-indexed to UI's 0-indexed
              pageSize: Number(size),
              totalPages: xpubs.page.totalPages,
              totalElements: xpubs.page.totalElements,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
