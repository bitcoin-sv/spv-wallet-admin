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
    searchTerm: z.string().optional().catch(''),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { queryClient, spvWallet } }) => {
    return await queryClient.ensureQueryData(
      paymailsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
      }),
    );
  },
});

export function Paymails() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { spvWalletClient } = useSpvWalletClient();
  const { sortBy, sort, createdRange, updatedRange } = useSearch({
    from: '/user/_user/paymails',
  });

  const [debouncedFilter] = useDebounce(filter, 500);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: paymails } = useSuspenseQuery(
    paymailsQueryOptions({
      spvWalletClient: spvWalletClient!,
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
      }),
      replace: true,
    });
  }, [debouncedFilter]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by alias or public name" />
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
