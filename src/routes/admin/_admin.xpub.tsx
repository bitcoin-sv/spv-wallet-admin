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
import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';

import { z } from 'zod';

export const Route = createFileRoute('/admin/_admin/xpub')({
  component: Xpub,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('asc'),
    id: z.string().optional(),
  }),
  loaderDeps: ({ search: { sortBy, sort, id } }) => ({
    sortBy,
    sort,
    id,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { queryClient }, deps: { sortBy, sort, id } }) =>
    await queryClient.ensureQueryData(
      xPubQueryOptions({
        id,
        sort,
        sortBy,
      }),
    ),
  pendingComponent: () => <XpubsSkeleton />,
});

export function Xpub() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter] = useDebounce(filter, 200);

  const navigate = useNavigate({ from: Route.fullPath });
  const { sortBy, sort, id } = useSearch({ from: '/admin/_admin/xpub' });

  const { data: xpubs } = useSuspenseQuery(xPubQueryOptions({ id, sortBy, sort }));

  const mappedXpubs = addStatusField(xpubs.content);

  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        id: debouncedFilter || undefined,
      }),
      replace: true,
    });
  }, [debouncedFilter]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between mt-1">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <AddXpubDialog className="mr-3" />
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by ID" />
          </div>
        </div>
        <TabsContent value="all">
          <XpubsTabContent xpubs={mappedXpubs} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
