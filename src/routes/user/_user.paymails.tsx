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
import { useSpvWalletClient } from '@/contexts';
import { paymailsQueryOptions, addStatusField } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

import { useDebounce } from 'use-debounce';
import { z } from 'zod';

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
  loader: async ({
    context: { queryClient, spvWallet },
    deps: { sort, sortBy, xpubId, createdRange, updatedRange, alias },
  }) =>
    await queryClient.ensureQueryData(
      paymailsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
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
  const [filter, setFilter] = useState<string>('');

  const { spvWalletClient } = useSpvWalletClient();
  const { sortBy, sort, createdRange, updatedRange, alias } = useSearch({
    from: '/user/_user/paymails',
  });

  const [debouncedFilter] = useDebounce(filter, 500);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: paymails } = useSuspenseQuery(
    paymailsQueryOptions({
      spvWalletClient: spvWalletClient!,
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
      });
    }
  }, [tab]);

  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        alias: filter || undefined,
      }),
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter(alias || '');
    navigate({
      search: (old) => ({
        ...old,
        alias,
      }),
      replace: true,
    });
  }, [alias]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by alias" />
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
