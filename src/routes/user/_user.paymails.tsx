import {
  CustomErrorComponent,
  PaymailsTabContent,
  Searchbar,
  DateRangeFilter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { paymailsQueryOptions, addStatusField } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';

export const Route = createFileRoute('/user/_user/paymails')({
  component: Paymails,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('desc'),
    alias: z.string().optional().catch(undefined),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  }),
  loaderDeps: ({ search: { sortBy, sort, createdRange, updatedRange, alias } }) => ({
    sortBy,
    sort,
    createdRange,
    updatedRange,
    alias,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { queryClient }, deps: { sort, sortBy, createdRange, updatedRange, alias } }) =>
    await queryClient.ensureQueryData(
      paymailsQueryOptions({
        sort,
        sortBy,
        createdRange,
        updatedRange,
        alias,
      }),
    ),
});

export function Paymails() {
  const [tab, setTab] = useState<string>('all');

  const navigate = useNavigate({ from: Route.fullPath });
  const { sortBy, sort, createdRange, updatedRange } = useSearch({
    from: '/user/_user/paymails',
  });
  const [alias, setAlias] = useSearchParam('/user/_user/paymails', 'alias');

  const { data: paymails } = useSuspenseQuery(
    paymailsQueryOptions({
      alias,
      sortBy,
      sort,
      createdRange,
      updatedRange,
    }),
  );

  const mappedPaymails = addStatusField(paymails.content);

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
          </TabsList>
          <div className="flex">
            <Searchbar filter={alias ?? ''} setFilter={setAlias} placeholder="Search by alias" />
            <DateRangeFilter withRevokedRange />
          </div>
        </div>
        <TabsContent value="all">
          <PaymailsTabContent paymails={mappedPaymails} hasPaymailDeleteDialog />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
