import {
  AddXpubDialog,
  CustomErrorComponent,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  XpubsTabContent,
  XpubsSkeleton,
} from '@/components';
import { addStatusField, xPubQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { ApiPaginationResponse, DEFAULT_PAGE_SIZE, DEFAULT_API_PAGE, convertFromApiPage } from '@/constants/pagination';
import { XPub } from '@bsv/spv-wallet-js-client';
import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';
import { useRoutePagination } from '@/components/DataTable';

interface XpubsApiResponse {
  content: XPub[];
  page: ApiPaginationResponse;
}

export const Route = createFileRoute('/admin/_admin/xpub')({
  component: Xpub,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('asc'),
    id: z.string().optional(),
    page: z.coerce.number().optional().default(DEFAULT_API_PAGE).catch(DEFAULT_API_PAGE),
    size: z.coerce.number().optional().default(DEFAULT_PAGE_SIZE).catch(DEFAULT_PAGE_SIZE),
  }),
  loaderDeps: ({ search: { sortBy, sort, id, page, size } }) => ({
    sortBy,
    sort,
    id,
    page,
    size,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  notFoundComponent: () => <CustomErrorComponent error={new Error('Page not found')} />,
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
  const { sortBy, sort, page = DEFAULT_API_PAGE, size = DEFAULT_PAGE_SIZE } = useSearch({ from: '/admin/_admin/xpub' });
  const [id, setID] = useSearchParam('/admin/_admin/xpub', 'id');

  const pagination = useRoutePagination('/admin/_admin/xpub');

  const { data } = useSuspenseQuery(
    xPubQueryOptions({
      id,
      sortBy,
      sort,
      page,
      size,
    }),
  );

  const xpubs = data as XpubsApiResponse;

  // Memoize the transformed xpubs data
  const mappedXpubs = useMemo(() => addStatusField(xpubs.content), [xpubs.content]);

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
              currentPage: convertFromApiPage(Number(page)), // Convert API's 1-indexed to UI's 0-indexed
              pageSize: Number(size),
              totalPages: xpubs.page.totalPages,
              totalElements: xpubs.page.totalElements,
              onPageChange: pagination.onPageChange,
              onPageSizeChange: pagination.onPageSizeChange,
            }}
          />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
