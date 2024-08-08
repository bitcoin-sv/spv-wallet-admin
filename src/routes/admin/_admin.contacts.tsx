import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';
import { z } from 'zod';

import {
  ContactAcceptDialog,
  ContactDeleteDialog,
  ContactEditDialog,
  ContactRejectDialog,
  ContactStatus,
  DateRangeFilter,
  Searchbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  ContactsTabContent,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { contactsQueryOptions, getContactId, getContactPaymail } from '@/utils';

// TODO [react-refresh]: only 1 export is allowed
// eslint-disable-next-line  react-refresh/only-export-components
export const contactsSearchSchema = z.object({
  createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  order_by_field: z.string().optional().catch('id'),
  sort_direction: z.string().optional().catch('desc'),
  updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  id: z.string().optional(),
  paymail: z.string().optional(),
  pubKey: z.string().optional(),
});

export const Route = createFileRoute('/admin/_admin/contacts')({
  component: Contacts,
  validateSearch: contactsSearchSchema,
  loaderDeps: ({ search: { order_by_field, sort_direction, createdRange, updatedRange, id, paymail, pubKey } }) => ({
    order_by_field,
    sort_direction,
    createdRange,
    updatedRange,
    id,
    paymail,
    pubKey,
  }),
  loader: async ({
    context: { spvWallet, queryClient },
    deps: { createdRange, updatedRange, order_by_field, sort_direction, id, paymail, pubKey },
  }) =>
    await queryClient.ensureQueryData(
      contactsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        updatedRange,
        createdRange,
        sort_direction,
        order_by_field,
        id,
        paymail,
        pubKey,
      }),
    ),
});

export function Contacts() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { spvWalletClient } = useSpvWalletClient();

  const { id, paymail, pubKey, createdRange, updatedRange, order_by_field, sort_direction } = useSearch({
    from: '/admin/_admin/contacts',
  });

  const {
    data: { content: contacts },
  } = useSuspenseQuery(
    contactsQueryOptions({
      spvWalletClient: spvWalletClient!,
      updatedRange,
      createdRange,
      sort_direction,
      order_by_field,
      id,
      paymail,
      pubKey,
    }),
  );

  const [debouncedFilter] = useDebounce(filter, 200);

  const unconfirmedContacts = contacts.filter((c) => c.status === ContactStatus.Unconfirmed && c.deleted_at === null);
  const awaitingContacts = contacts.filter((c) => c.status === ContactStatus.Awaiting);
  const confirmedContacts = contacts.filter((c) => c.status === ContactStatus.Confirmed);
  const rejectedContacts = contacts.filter((c) => c.status === ContactStatus.Rejected);
  const deletedContacts = contacts.filter((c) => c.deleted_at !== null);

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
    navigate({
      search: (old) => {
        const id = getContactId(filter);
        const paymail = getContactPaymail(filter);
        return {
          ...old,
          id,
          paymail,
          pubKey: !id && !paymail && filter ? filter : undefined,
        };
      },
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter(id || paymail || pubKey || '');
    navigate({
      search: (old) => {
        const id = getContactId(filter);
        const paymail = getContactPaymail(filter);
        return {
          ...old,
          id,
          paymail,
          pubKey: !id && !paymail && filter ? filter : undefined,
        };
      },
      replace: true,
    });
  }, [id, paymail, pubKey]);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
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
            <Searchbar filter={filter} setFilter={setFilter} />
            <DateRangeFilter />
          </div>
        </div>
        <TabsContent value="all">
          <ContactsTabContent
            contacts={contacts}
            AcceptDialog={ContactAcceptDialog}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={ContactDeleteDialog}
            RejectDialog={ContactRejectDialog}
          />
        </TabsContent>
        <TabsContent value="unconfirmed">
          <ContactsTabContent
            contacts={unconfirmedContacts}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={ContactDeleteDialog}
          />
        </TabsContent>
        <TabsContent value="awaiting">
          <ContactsTabContent
            contacts={awaitingContacts}
            AcceptDialog={ContactAcceptDialog}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={ContactDeleteDialog}
            RejectDialog={ContactRejectDialog}
          />
        </TabsContent>
        <TabsContent value="confirmed">
          <ContactsTabContent
            contacts={confirmedContacts}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={ContactDeleteDialog}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <ContactsTabContent
            contacts={rejectedContacts}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={ContactDeleteDialog}
          />
        </TabsContent>
        <TabsContent value="deleted">
          <ContactsTabContent
            contacts={deletedContacts}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={ContactDeleteDialog}
          />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
