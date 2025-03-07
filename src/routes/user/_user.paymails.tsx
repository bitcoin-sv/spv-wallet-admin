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
import { paymailsQueryOptions, addStatusField, getDeletedElements } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';
import { ApiPaginationResponse, DEFAULT_PAGE_SIZE, DEFAULT_API_PAGE, convertFromApiPage } from '@/constants/pagination';
import { useRoutePagination } from '@/components/DataTable';
import { PaymailAddress } from '@bsv/spv-wallet-js-client';

interface PaymailsApiResponse {
  content: PaymailAddress[];
  page: ApiPaginationResponse;
}

export const Route = createFileRoute('/user/_user/paymails')({
  component: Paymails,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('desc'),
    alias: z.string().optional().catch(undefined),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    page: z.coerce.number().optional().catch(DEFAULT_API_PAGE),
    size: z.coerce.number().optional().catch(DEFAULT_PAGE_SIZE),
  }),
  loaderDeps: ({ search: { sortBy, sort, createdRange, updatedRange, alias, page, size } }) => ({
    sortBy,
    sort,
    createdRange,
    updatedRange,
    alias,
    page,
    size,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({
    context: { queryClient },
    deps: { sort, sortBy, createdRange, updatedRange, alias, page, size },
  }): Promise<PaymailsApiResponse> =>
    await queryClient.ensureQueryData(
      paymailsQueryOptions({
        sort,
        sortBy,
        createdRange,
        updatedRange,
        alias,
        page,
        size,
      }),
    ),
});

export function Paymails() {
  const [tab, setTab] = useState<string>('all');
  const navigate = useNavigate({ from: Route.fullPath });
  const {
    sortBy,
    sort,
    createdRange,
    updatedRange,
    page = DEFAULT_API_PAGE,
    size = DEFAULT_PAGE_SIZE,
  } = useSearch({
    from: '/user/_user/paymails',
  });
  const [alias, setAlias] = useSearchParam('/user/_user/paymails', 'alias');

  // Use our custom pagination hook
  const pagination = useRoutePagination('/user/_user/paymails');

  const { data } = useSuspenseQuery(
    paymailsQueryOptions({
      alias,
      sortBy,
      sort,
      createdRange,
      updatedRange,
      page,
      size,
    }),
  );

  const paymailsResponse = data as PaymailsApiResponse;
  const { content, page: apiPage } = paymailsResponse;
  const { totalElements, totalPages } = apiPage;

  // Memoize data transformations
  const mappedPaymails = useMemo(() => addStatusField(content), [content]);
  const deletedPaymails = useMemo(() => getDeletedElements(mappedPaymails), [mappedPaymails]);

  // Clear search parameters when tab is not "all"
  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => ({}),
        replace: false,
      }).catch(console.error);
    }
  }, [tab, navigate]);

  return (
    <>
      <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mt-1">
          <TabsList className="w-full sm:w-auto grid grid-cols-2 gap-2">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground px-8"
            >
              All
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
              <Searchbar filter={alias ?? ''} setFilter={setAlias} placeholder="Search by alias" />
            </div>
            <div className="flex-1 sm:flex-initial">
              <DateRangeFilter withRevokedRange className="w-full" />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <PaymailsTabContent
            paymails={mappedPaymails}
            hasPaymailDeleteDialog
            pagination={{
              currentPage: convertFromApiPage(Number(page)), // Convert from 1-indexed (API) to 0-indexed (UI)
              pageSize: Number(size),
              totalPages,
              totalElements,
              onPageChange: pagination.onPageChange,
              onPageSizeChange: pagination.onPageSizeChange,
            }}
          />
        </TabsContent>
        <TabsContent value="deleted">
          <PaymailsTabContent paymails={deletedPaymails} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
