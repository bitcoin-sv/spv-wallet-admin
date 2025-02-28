import {
  AddPaymailDialog,
  CustomErrorComponent,
  DateRangeFilter,
  PaymailsTabContent,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { addStatusField, getDeletedElements, paymailsAdminQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';

export const Route = createFileRoute('/admin/_admin/paymails')({
  component: Paymails,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('desc'),
    xpubId: z.string().optional().catch(''),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  }),
  loaderDeps: ({ search: { sortBy, sort, xpubId, createdRange, updatedRange } }) => ({
    sortBy,
    sort,
    xpubId,
    createdRange,
    updatedRange,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { queryClient }, deps: { sort, sortBy, xpubId, createdRange, updatedRange } }) =>
    await queryClient.ensureQueryData(
      paymailsAdminQueryOptions({
        xpubId,
        sort,
        sortBy,
        createdRange,
        updatedRange,
      }),
    ),
});

export function Paymails() {
  const [tab, setTab] = useState<string>('all');

  const navigate = useNavigate({ from: Route.fullPath });
  const { sortBy, sort, createdRange, updatedRange } = useSearch({
    from: '/admin/_admin/paymails',
  });
  const [xpubId, setXPubId] = useSearchParam('/admin/_admin/paymails', 'xpubId');

  const { data: paymails } = useSuspenseQuery(
    paymailsAdminQueryOptions({
      xpubId,
      sortBy,
      sort,
      createdRange,
      updatedRange,
    }),
  );

  const mappedPaymails = addStatusField(paymails.content);
  const deletedPaymails = getDeletedElements(mappedPaymails);

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
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <AddPaymailDialog className="mr-3" />
            <Searchbar filter={xpubId ?? ''} setFilter={setXPubId} placeholder="Search by xpubID" />
            <DateRangeFilter />
          </div>
        </div>
        <TabsContent value="all">
          <PaymailsTabContent paymails={mappedPaymails} hasPaymailDeleteDialog />
        </TabsContent>
        <TabsContent value="deleted">
          <PaymailsTabContent paymails={deletedPaymails} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
