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
    if (filter === '') {
      setID(undefined);
      setPaymail(undefined);
      setPubKey(undefined);
    } else if (filter.length === CONTACT_ID_LENGTH) {
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
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unconfirmed">Unconfirmed</TabsTrigger>
            <TabsTrigger value="awaiting">Awaiting</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <Searchbar filter={filter} setFilter={setFilter} placeholder="Search by ID, Paymail or PubKey" />
            <DateRangeFilter />
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
