import {
  ContactsTabContent,
  CustomErrorComponent,
  DateRangeFilter,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';
import { contactsQueryOptions, ContactStatus as ApiContactStatus } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { CONTACT_ID_LENGTH } from '@/constants';
import { useSearchParam } from '@/hooks/useSearchParam.ts';
import { ContactExtended } from '@/interfaces/contacts';
import { ApiPaginationResponse, DEFAULT_PAGE_SIZE, DEFAULT_API_PAGE, convertFromApiPage } from '@/constants/pagination';
import { useRoutePagination } from '@/components/DataTable';

interface ContactsApiResponse {
  content: ContactExtended[];
  page: ApiPaginationResponse;
}

export const Route = createFileRoute('/admin/_admin/contacts')({
  component: Contacts,
  validateSearch: z.object({
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    sortBy: z.string().optional().catch('id'),
    sort: z.string().optional().catch('desc'),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    id: z.string().optional(),
    paymail: z.string().optional(),
    pubKey: z.string().optional(),
    status: z.enum(['unconfirmed', 'awaiting', 'confirmed', 'rejected']).optional(),
    page: z.coerce.number().optional().catch(DEFAULT_API_PAGE),
    size: z.coerce.number().optional().catch(DEFAULT_PAGE_SIZE),
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loaderDeps: ({ search: { sortBy, sort, createdRange, updatedRange, id, paymail, pubKey, status, page, size } }) => ({
    sortBy,
    sort,
    createdRange,
    updatedRange,
    id,
    paymail,
    pubKey,
    status,
    page,
    size,
  }),
  loader: async ({
    context: { queryClient },
    deps: { createdRange, updatedRange, sortBy, sort, id, paymail, pubKey, status, page, size },
  }): Promise<ContactsApiResponse> =>
    await queryClient.ensureQueryData(
      contactsQueryOptions({
        updatedRange,
        createdRange,
        sort,
        sortBy,
        id,
        paymail,
        pubKey,
        status,
        page,
        size,
        includeDeleted: true,
      }),
    ),
});

export function Contacts() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const {
    sortBy,
    sort,
    createdRange,
    updatedRange,
    page = DEFAULT_API_PAGE,
    size = DEFAULT_PAGE_SIZE,
  } = useSearch({
    from: '/admin/_admin/contacts',
  });
  const [id, setID] = useSearchParam('/admin/_admin/contacts', 'id');
  const [paymail, setPaymail] = useSearchParam('/admin/_admin/contacts', 'paymail');
  const [pubKey, setPubKey] = useSearchParam('/admin/_admin/contacts', 'pubKey');
  const [statusParam, setStatusParam] = useSearchParam('/admin/_admin/contacts', 'status');

  const navigate = useNavigate({ from: Route.fullPath });

  // Use our custom pagination hook
  const pagination = useRoutePagination('/admin/_admin/contacts');

  // Update status parameter when tab changes
  useEffect(() => {
    switch (tab) {
      case 'deleted':
      case 'all':
        // For deleted and all tabs, we don't set a status
        setStatusParam(undefined);
        break;
      case 'unconfirmed':
        setStatusParam('unconfirmed' as ApiContactStatus);
        break;
      case 'awaiting':
        setStatusParam('awaiting' as ApiContactStatus);
        break;
      case 'confirmed':
        setStatusParam('confirmed' as ApiContactStatus);
        break;
      case 'rejected':
        setStatusParam('rejected' as ApiContactStatus);
        break;
    }
  }, [tab, setStatusParam]);

  // Use the data from the loader
  const { data } = useSuspenseQuery(
    contactsQueryOptions({
      updatedRange,
      createdRange,
      sort,
      sortBy,
      id,
      paymail,
      pubKey,
      page,
      size,
      status: statusParam as ApiContactStatus,
      includeDeleted: true,
    }),
  );

  const contactsResponse = data as ContactsApiResponse;

  const contacts = contactsResponse.content;
  const totalElements = contactsResponse.page.totalElements;
  const totalPages = contactsResponse.page.totalPages;
  const pageSize = contactsResponse.page.size;
  const currentPage = contactsResponse.page.number;

  // Clear search parameters when the tab is not "all", but preserve the status parameter
  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: (old) => ({ status: old.status }),
        replace: false,
      });
    }
  }, [tab, navigate]);

  // Update search parameters based on filter input
  useEffect(() => {
    if (filter) {
      if (filter.length === CONTACT_ID_LENGTH) {
        setID(filter);
        setPaymail('');
        setPubKey('');
      } else {
        setID('');
        if (filter.includes('@')) {
          setPaymail(filter);
          setPubKey('');
        } else {
          setPaymail('');
          setPubKey(filter);
        }
      }
    } else {
      setID('');
      setPaymail('');
      setPubKey('');
    }
  }, [filter, setID, setPaymail, setPubKey]);

  // Helper component to abstract TabsTrigger styling
  const TabButton = ({ value, children }: { value: string; children: React.ReactNode }) => (
    <TabsTrigger
      value={value}
      className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
    >
      {children}
    </TabsTrigger>
  );

  return (
    <>
      <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="w-full">
        <div className="flex flex-col gap-4 mt-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              {/* Desktop version - single row */}
              <TabsList className="hidden sm:flex h-9 items-center justify-start rounded-lg p-1 text-muted-foreground bg-muted">
                <TabButton value="all">All</TabButton>
                <TabButton value="awaiting">Awaiting</TabButton>
                <TabButton value="rejected">Rejected</TabButton>
                <TabButton value="confirmed">Confirmed</TabButton>
                <TabButton value="unconfirmed">Unconfirmed</TabButton>
                <TabButton value="deleted">Deleted</TabButton>
              </TabsList>

              {/* Mobile version - stacked rows */}
              <div className="flex flex-col gap-2 sm:hidden">
                <div className="flex justify-center gap-2">
                  <TabsList className="h-9 flex-1 grid grid-cols-3 p-1 bg-muted">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="awaiting"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Awaiting
                    </TabsTrigger>
                    <TabsTrigger
                      value="rejected"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Rejected
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex justify-center gap-2">
                  <TabsList className="h-9 flex-1 grid grid-cols-3 p-1 bg-muted">
                    <TabsTrigger
                      value="confirmed"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Confirmed
                    </TabsTrigger>
                    <TabsTrigger
                      value="unconfirmed"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Unconfirmed
                    </TabsTrigger>
                    <TabsTrigger
                      value="deleted"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Deleted
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by ID, Paymail or PubKey" />
              </div>
              <DateRangeFilter />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <ContactsTabContent
            contacts={contacts}
            pagination={{
              currentPage: convertFromApiPage(currentPage), // Convert from 1-indexed (API) to 0-indexed (UI)
              pageSize,
              totalPages,
              totalElements,
              onPageChange: pagination.onPageChange,
              onPageSizeChange: pagination.onPageSizeChange,
            }}
          />
        </TabsContent>
        <TabsContent value="unconfirmed">
          <ContactsTabContent contacts={contacts} />
        </TabsContent>
        <TabsContent value="awaiting">
          <ContactsTabContent contacts={contacts} />
        </TabsContent>
        <TabsContent value="confirmed">
          <ContactsTabContent contacts={contacts} />
        </TabsContent>
        <TabsContent value="rejected">
          <ContactsTabContent contacts={contacts} />
        </TabsContent>
        <TabsContent value="deleted">
          <ContactsTabContent contacts={contacts.filter((c: ContactExtended) => c.deletedAt !== null)} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
