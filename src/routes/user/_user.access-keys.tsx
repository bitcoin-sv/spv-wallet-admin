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
import { AccessKey } from '@bsv/spv-wallet-js-client';
import { useEffect, useState, useMemo } from 'react';
import { z } from 'zod';
import { ApiPaginationResponse, DEFAULT_PAGE_SIZE, DEFAULT_API_PAGE, convertFromApiPage } from '@/constants/pagination';
import { useRoutePagination } from '@/components/DataTable';

interface AccessKeysApiResponse {
  content: AccessKey[];
  page: ApiPaginationResponse;
}

export const Route = createFileRoute('/user/_user/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sortBy: z.string().optional().catch('id'),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sort: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    page: z.number().optional().catch(DEFAULT_API_PAGE),
    size: z.number().optional().catch(DEFAULT_PAGE_SIZE),
  }),
  loaderDeps: ({ search: { sortBy, sort, createdRange, revokedRange, updatedRange, page, size } }) => ({
    sortBy,
    sort,
    createdRange,
    updatedRange,
    revokedRange,
    page,
    size,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({
    context: { queryClient },
    deps: { sortBy, sort, createdRange, updatedRange, revokedRange, page, size },
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
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');

  const {
    sortBy,
    sort,
    createdRange,
    updatedRange,
    revokedRange,
    page = DEFAULT_API_PAGE,
    size = DEFAULT_PAGE_SIZE,
  } = useSearch({
    from: '/user/_user/access-keys',
  });
  const navigate = useNavigate({ from: Route.fullPath });

  const pagination = useRoutePagination('/user/_user/access-keys');

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

  const { content, page: apiPage } = accessKeys as AccessKeysApiResponse;

  // Memoize the transformed access keys
  const mappedAccessKeys = useMemo(() => addStatusField(content), [content]);
  const revokedKeys = useMemo(() => getRevokedElements(mappedAccessKeys), [mappedAccessKeys]);
  const deletedKeys = useMemo(() => getDeletedElements(mappedAccessKeys), [mappedAccessKeys]);

  // Calculate pagination values
  const { totalElements, totalPages } = apiPage;
  const currentPage = convertFromApiPage(apiPage.number); // Convert from 1-indexed (API) to 0-indexed (UI)
  const pageSize = apiPage.size || DEFAULT_PAGE_SIZE;

  // Clear URL search parameters when the active tab is not "all"
  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => ({}),
        replace: true,
      }).catch(console.error);
    }
  }, [tab, navigate]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
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
          <AccessKeysTabContent
            accessKeys={mappedAccessKeys}
            hasRevokeKeyDialog
            pagination={{
              totalElements,
              totalPages,
              currentPage,
              pageSize,
              onPageChange: pagination.onPageChange,
              onPageSizeChange: pagination.onPageSizeChange,
            }}
          />
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
