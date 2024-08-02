import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useState } from 'react';

import { useDebounce } from 'use-debounce';

import { z } from 'zod';

import {
  AddXpubDialog,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  XpubsSkeleton,
  XpubsTabContent,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import { addStatusField, xPubQueryOptions } from '@/utils';

// TODO [react-refresh]: only 1 export is allowed
// eslint-disable-next-line  react-refresh/only-export-components
export const xpubSearchSchema = z.object({
  order_by_field: z.string().optional().catch('id'),
  sort_direction: z.string().optional().catch('asc'),
});

export const Route = createFileRoute('/admin/_admin/xpub')({
  validateSearch: xpubSearchSchema,
  component: Xpub,
  pendingComponent: () => <XpubsSkeleton />,
});

export function Xpub() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter] = useDebounce(filter, 200);
  const { order_by_field, sort_direction } = useSearch({ from: '/admin/_admin/xpub' });

  const { data: xpubs } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    xPubQueryOptions({ spvWalletClient: spvWalletClient!, filterStr: debouncedFilter, order_by_field, sort_direction }),
  );

  const mappedXpubs = addStatusField(xpubs);

  // TODO: Add server pagination for xpubs when search and count will be merged

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex">
            <AddXpubDialog className="mr-3" />
            <Searchbar filter={filter} setFilter={setFilter} />
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
