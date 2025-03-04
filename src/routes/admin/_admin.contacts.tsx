import {
  ContactsTabContent,
  ContactStatus,
  CustomErrorComponent,
  DateRangeFilter,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '@/components';

import { contactsQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { z } from 'zod';
import { CONTACT_ID_LENGTH } from '@/constants';
import { useSearchParam } from '@/hooks/useSearchParam.ts';

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
  }),
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loaderDeps: ({ search: { sortBy, sort, createdRange, updatedRange, id, paymail, pubKey } }) => ({
    sortBy,
    sort,
    createdRange,
    updatedRange,
    id,
    paymail,
    pubKey,
  }),
  loader: async ({
    context: { queryClient },
    deps: { createdRange, updatedRange, sortBy, sort, id, paymail, pubKey },
  }) =>
    await queryClient.ensureQueryData(
      contactsQueryOptions({
        updatedRange,
        createdRange,
        sort,
        sortBy,
        id,
        paymail,
        pubKey,
      }),
    ),
});

export function Contacts() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { createdRange, updatedRange, sortBy, sort } = useSearch({
    from: '/admin/_admin/contacts',
  });
  const [id, setID] = useSearchParam('/admin/_admin/contacts', 'id');
  const [paymail, setPaymail] = useSearchParam('/admin/_admin/contacts', 'paymail');
  const [pubKey, setPubKey] = useSearchParam('/admin/_admin/contacts', 'pubKey');

  const {
    data: { content: contacts },
  } = useSuspenseQuery(
    contactsQueryOptions({
      updatedRange,
      createdRange,
      sort,
      sortBy,
      id,
      paymail,
      pubKey,
    }),
  );

  const unconfirmedContacts = contacts.filter((c) => c.status === ContactStatus.Unconfirmed && c.deletedAt === null);
  const awaitingContacts = contacts.filter((c) => c.status === ContactStatus.Awaiting);
  const confirmedContacts = contacts.filter((c) => c.status === ContactStatus.Confirmed);
  const rejectedContacts = contacts.filter((c) => c.status === ContactStatus.Rejected);
  const deletedContacts = contacts.filter((c) => c.deletedAt !== null);

  const navigate = useNavigate({ from: Route.fullPath });

  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => ({}),
        replace: false,
      });
    }
  }, [tab]);

  useEffect(() => {
   if (!filter) {
    setID(undefined);
    setPaymail(undefined);
    setPubKey(undefined);
    return;
  }

  if (filter.length === CONTACT_ID_LENGTH) {
    setID(filter);
  } else if (filter.includes('@')) {
    setPaymail(filter);
  } else {
    setPubKey(filter);
  }
}, [filter]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
        <div className="flex flex-col gap-4 mt-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              {/* Desktop version - single row */}
              <TabsList className="hidden sm:flex h-9 items-center justify-start rounded-lg p-1 text-muted-foreground bg-muted">
                <TabsTrigger
                  value="all"
                  className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="awaiting"
                  className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
                >
                  Awaiting
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
                >
                  Rejected
                </TabsTrigger>
                <TabsTrigger
                  value="confirmed"
                  className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
                >
                  Confirmed
                </TabsTrigger>
                <TabsTrigger
                  value="unconfirmed"
                  className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
                >
                  Unconfirmed
                </TabsTrigger>
                <TabsTrigger
                  value="deleted"
                  className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm h-8 px-4 py-2"
                >
                  Deleted
                </TabsTrigger>
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
          <ContactsTabContent contacts={contacts} />
        </TabsContent>
        <TabsContent value="unconfirmed">
          <ContactsTabContent contacts={unconfirmedContacts} />
        </TabsContent>
        <TabsContent value="awaiting">
          <ContactsTabContent contacts={awaitingContacts} />
        </TabsContent>
        <TabsContent value="confirmed">
          <ContactsTabContent contacts={confirmedContacts} />
        </TabsContent>
        <TabsContent value="rejected">
          <ContactsTabContent contacts={rejectedContacts} />
        </TabsContent>
        <TabsContent value="deleted">
          <ContactsTabContent contacts={deletedContacts} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
