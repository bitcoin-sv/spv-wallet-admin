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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { z } from 'zod';
import { useSearchParam } from '@/hooks/useSearchParam.ts';
import { PaymailAddress } from '@bsv/spv-wallet-js-client';

// Define interface for API response
interface PaymailsApiResponse {
  content: PaymailAddress[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// Utility functions for pagination conversion
const convertToApiPage = (uiPage: number): number => uiPage + 1;

export const Route = createFileRoute('/admin/_admin/paymails')({
  component: Paymails,
  validateSearch: z.object({
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('desc'),
    xpubId: z.string().optional().catch(''),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    page: z.coerce.number().optional().catch(1),
    size: z.coerce.number().optional().catch(10),
  }),
  loaderDeps: ({ search: { sortBy, sort, xpubId, createdRange, updatedRange, page, size } }) => ({
    sortBy,
    sort,
    xpubId,
    createdRange,
    updatedRange,
    page,
    size,
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({
    context: { queryClient },
    deps: { sort, sortBy, xpubId, createdRange, updatedRange, page, size },
  }): Promise<PaymailsApiResponse> =>
    await queryClient.ensureQueryData(
      paymailsAdminQueryOptions({
        xpubId,
        sort,
        sortBy,
        createdRange,
        updatedRange,
        page,
        size,
        includeDeleted: true,
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
    page = 1,
    size = 10,
  } = useSearch({
    from: '/admin/_admin/paymails',
  });
  const [xpubId, setXPubId] = useSearchParam('/admin/_admin/paymails', 'xpubId');

  const { data } = useSuspenseQuery(
    paymailsAdminQueryOptions({
      xpubId,
      sortBy,
      sort,
      createdRange,
      updatedRange,
      page,
      size,
      includeDeleted: true,
    }),
  );

  // Cast the response to access the pagination data
  const paymailsResponse = data as PaymailsApiResponse;

  const { content: paymails, page: apiPage } = paymailsResponse;
  const { totalElements, totalPages } = apiPage;

  // Memoize data transformations
  const mappedPaymails = useMemo(() => addStatusField(paymails), [paymails]);
  const deletedPaymails = useMemo(() => getDeletedElements(mappedPaymails), [mappedPaymails]);

  // Clear URL search parameters when not in 'all' tab
  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => ({}),
        replace: false,
      }).catch(console.error);
    }
  }, [tab, navigate]);

  // Use useCallback to memoize pagination handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      navigate({
        search: (old) => ({
          ...old,
          page: convertToApiPage(newPage),
          size: old.size || 10,
        }),
        replace: true,
      });
    },
    [navigate],
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      navigate({
        search: (old) => ({
          ...old,
          size: newSize,
          page: 1, // Reset to first page when changing page size
        }),
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <>
      <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="w-full">
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
              <AddPaymailDialog className="w-full" />
            </div>
            <div className="flex-1 sm:flex-initial">
              <Searchbar filter={xpubId ?? ''} setFilter={setXPubId} placeholder="Search by xpubID" />
            </div>
            <div className="flex-1 sm:flex-initial">
              <DateRangeFilter className="w-full" />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <PaymailsTabContent
            paymails={mappedPaymails}
            hasPaymailDeleteDialog
            pagination={{
              currentPage: page ? page - 1 : 0, // Convert from 1-indexed (API) to 0-indexed (UI)
              pageSize: size || 10,
              totalPages,
              totalElements,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
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
