import {
  AccessKeysTabContent,
  CustomErrorComponent,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';

import { accessKeysAdminQueryOptions, addStatusField, getDeletedElements, getRevokedElements } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { AccessKey } from '@bsv/spv-wallet-js-client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';
import { ApiPaginationResponse, DEFAULT_PAGE_SIZE, DEFAULT_API_PAGE, convertFromApiPage } from '@/constants/pagination';
import { useRoutePagination } from '@/components/DataTable';

interface AccessKeysApiResponse {
  content: AccessKey[];
  page: ApiPaginationResponse;
}

export const Route = createFileRoute('/admin/_admin/access-keys')({
  component: AccessKeys,
  validateSearch: z.object({
    xpubId: z.string().optional(),
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('asc'),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional(),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional(),
    revokedRange: z.object({ from: z.string(), to: z.string() }).optional(),
    page: z.coerce.number().optional().default(DEFAULT_API_PAGE).catch(DEFAULT_API_PAGE),
    size: z.coerce.number().optional().default(DEFAULT_PAGE_SIZE).catch(DEFAULT_PAGE_SIZE),
  }),
  loaderDeps: ({ search: { xpubId, sortBy, sort, createdRange, updatedRange, revokedRange, page, size } }) => ({
    xpubId,
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
    deps: { xpubId, sortBy, sort, createdRange, updatedRange, revokedRange, page, size },
  }) =>
    await queryClient.ensureQueryData(
      accessKeysAdminQueryOptions({
        xpubId,
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
    xpubId,
    sortBy,
    sort,
    createdRange,
    updatedRange,
    revokedRange,
    page = DEFAULT_API_PAGE,
    size = DEFAULT_PAGE_SIZE,
  } = useSearch({
    from: '/admin/_admin/access-keys',
  });

  const navigate = useNavigate({ from: Route.fullPath });

  const pagination = useRoutePagination('/admin/_admin/access-keys');

  // Local filter state for input field
  const [filter, setFilter] = useState<string>(xpubId || '');
  const [debouncedFilter] = useDebounce(filter, 500);

  // Update URL when the debounced filter changes
  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        xpubId: debouncedFilter || undefined,
      }),
      replace: true,
    });
  }, [debouncedFilter, navigate]);

  // Sync filter input when URL xpubId changes
  useEffect(() => {
    setFilter(xpubId || '');
  }, [xpubId]);

  const { data } = useSuspenseQuery(
    accessKeysAdminQueryOptions({
      xpubId,
      sortBy,
      sort,
      createdRange,
      updatedRange,
      revokedRange,
      page,
      size,
    }),
  );

  const accessKeysResponse = data as AccessKeysApiResponse;

  // Memoize data transformations
  const mappedAccessKeys = useMemo(() => addStatusField(accessKeysResponse.content), [accessKeysResponse.content]);
  const revokedKeys = useMemo(() => getRevokedElements(mappedAccessKeys), [mappedAccessKeys]);
  const deletedKeys = useMemo(() => getDeletedElements(mappedAccessKeys), [mappedAccessKeys]);

  const { totalElements, totalPages } = accessKeysResponse.page;
  // Adjust for 0-indexed UI pagination
  const currentPage = convertFromApiPage(accessKeysResponse.page.number);
  const pageSize = accessKeysResponse.page.size || DEFAULT_PAGE_SIZE;

  // Memoize tab change handler
  const handleTabChange = useCallback(
    (value: string) => {
      setTab(value);
      if (value !== 'all') {
        navigate({
          search: () => ({}),
          replace: true,
        });
      }
    },
    [navigate],
  );

  // Helper component for TabsTrigger to reduce duplication
  const TabButton = ({ value, children }: { value: string; children: React.ReactNode }) => (
    <TabsTrigger
      value={value}
      className="relative h-8 rounded-md px-3 py-1.5 text-sm font-medium text-foreground shadow-none transition-colors hover:bg-background/50 focus-visible:bg-background/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm"
    >
      {children}
    </TabsTrigger>
  );

  return (
    <>
      <Tabs
        defaultValue={tab}
        onValueChange={handleTabChange}
        className="max-w-screen overflow-x-scroll scrollbar-hide"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          {/* Desktop Tabs */}
          <TabsList className="hidden sm:flex h-9 items-center justify-start rounded-lg p-1 text-muted-foreground bg-muted">
            <TabButton value="all">All</TabButton>
            <TabButton value="revoked">Revoked</TabButton>
            <TabButton value="deleted">Deleted</TabButton>
          </TabsList>

          {/* Mobile Tabs */}
          <TabsList className="flex sm:hidden h-9 items-center justify-start rounded-lg p-1 text-muted-foreground bg-muted">
            <TabButton value="all">All</TabButton>
            <TabButton value="revoked">Revoked</TabButton>
            <TabButton value="deleted">Deleted</TabButton>
          </TabsList>

          <div className="flex">
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by XPub ID" />
          </div>
        </div>

        <TabsContent value="all">
          <AccessKeysTabContent
            accessKeys={mappedAccessKeys}
            pagination={{
              currentPage,
              pageSize,
              totalPages,
              totalElements,
              onPageChange: pagination.onPageChange,
              onPageSizeChange: pagination.onPageSizeChange,
            }}
          />
        </TabsContent>
        <TabsContent value="revoked">
          <AccessKeysTabContent
            accessKeys={revokedKeys}
            pagination={{
              currentPage: 0,
              pageSize: revokedKeys.length,
              totalPages: 1,
              totalElements: revokedKeys.length,
              onPageChange: () => {},
              onPageSizeChange: () => {},
            }}
          />
        </TabsContent>
        <TabsContent value="deleted">
          <AccessKeysTabContent
            accessKeys={deletedKeys}
            pagination={{
              currentPage: 0,
              pageSize: deletedKeys.length,
              totalPages: 1,
              totalElements: deletedKeys.length,
              onPageChange: () => {},
              onPageSizeChange: () => {},
            }}
          />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
