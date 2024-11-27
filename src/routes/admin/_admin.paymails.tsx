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
import { useSpvWalletClient } from '@/contexts';
import { addStatusField, getDeletedElements, paymailsQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';
import { z } from 'zod';

export const Route = createFileRoute('/admin/_admin/paymails')({
  component: Paymails,
  validateSearch: z.object({
    order_by_field: z.string().optional().catch('id'),
    sort_direction: z.string().optional().catch('desc'),
    xpubId: z.string().optional().catch(''),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  }),
  loaderDeps: ({ search: { order_by_field, sort_direction, xpubId, createdRange, updatedRange } }) => ({
    order_by_field,
    sort_direction,
    xpubId,
    createdRange,
    updatedRange,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({
    context: { queryClient, spvWallet },
    deps: { sort_direction, order_by_field, xpubId, createdRange, updatedRange },
  }) =>
    await queryClient.ensureQueryData(
      paymailsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        xpubId,
        sort_direction,
        order_by_field,
        createdRange,
        updatedRange,
      }),
    ),
});

export function Paymails() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { spvWalletClient } = useSpvWalletClient();
  const { order_by_field, sort_direction, xpubId, createdRange, updatedRange } = useSearch({
    from: '/admin/_admin/paymails',
  });

  const [debouncedFilter] = useDebounce(filter, 200);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: paymails } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    paymailsQueryOptions({
      spvWalletClient: spvWalletClient!,
      xpubId,
      order_by_field,
      sort_direction,
      createdRange,
      updatedRange,
    }),
  );

  const mappedPaymails = addStatusField(paymails);
  const deletedPaymails = getDeletedElements(mappedPaymails);

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
        xpubId: filter || undefined,
      }),
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter(xpubId || '');
    navigate({
      search: (old) => ({
        ...old,
        xpubId,
      }),
      replace: true,
    });
  }, [xpubId]);

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
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by xpubID" />
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
