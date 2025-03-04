import {
  AccessKeysTabContent,
  AddAccessKeyDialog,
  CustomErrorComponent,
  DateRangeFilter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';

import { accessKeysQueryOptions, addStatusField, getDeletedElements, getRevokedElements } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';

export const Route = createFileRoute('/user/_user/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sortBy: z.string().optional().catch('id'),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sort: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    page: z.number().optional().catch(1),
    size: z.number().optional().catch(10),
  }),
  loaderDeps: ({ search: { sortBy, sort, createdRange, revokedRange, updatedRange, page, size } }) => {
    return {
      sortBy,
      sort,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      size,
    };
  },
  loader: async ({
    context: { queryClient },
    deps: { sortBy, sort, page, size, createdRange, revokedRange, updatedRange },
  }) =>
    await queryClient.ensureQueryData(
      accessKeysQueryOptions({
        sortBy,
        sort,
        createdRange,
        updatedRange,
        revokedRange,
        page,
        size,
      }),
    ),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');

  const { sortBy, sort, createdRange, updatedRange, revokedRange, page, size } = useSearch({
    from: '/user/_user/access-keys',
  });

  const navigate = useNavigate({ from: Route.fullPath });

  const { data: accessKeys } = useSuspenseQuery(
    accessKeysQueryOptions({
      sortBy,
      sort,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      size,
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mt-1">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 gap-2">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-8"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="revoked"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-8"
            >
              Revoked
            </TabsTrigger>
            <TabsTrigger
              value="deleted"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-8"
            >
              Deleted
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center justify-between px-4 sm:px-1 w-full sm:w-auto gap-4 sm:gap-2">
            <div className="flex-1 sm:flex-initial">
              <AddAccessKeyDialog className="w-full" />
            </div>
            <div className="flex-1 sm:flex-initial">
              <DateRangeFilter withRevokedRange className="w-full" />
            </div>
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
