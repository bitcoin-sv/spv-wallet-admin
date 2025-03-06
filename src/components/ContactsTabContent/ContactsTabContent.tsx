import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ContactAcceptDialog,
  ContactDeleteDialog,
  ContactEditDialog,
  ContactRejectDialog,
  contactsColumns,
  ContactStatus,
  DataTable,
  NoRecordsText,
  ViewDialog,
} from '@/components';
import { ContactsMobileList } from '@/components/ContactsColumns/ContactsColumnsMobile';
import { ContactExtended } from '@/interfaces/contacts.ts';
import { useState } from 'react';
import { PaginationProps } from '@/components/DataTable/DataTable';

export interface ContactsTabContentProps {
  contacts: ContactExtended[];
  pagination?: PaginationProps;
}

export const ContactsTabContent = ({ contacts, pagination }: ContactsTabContentProps) => {
  const [searchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) => {
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        contact.id.toLowerCase().includes(searchLower) ||
        (contact.paymail && contact.paymail.toLowerCase().includes(searchLower)) ||
        (contact.fullName && contact.fullName.toLowerCase().includes(searchLower)) ||
        (contact.pubKey && contact.pubKey.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {filteredContacts.length > 0 ? (
          <>
            <div className="hidden sm:block">
              <DataTable
                columns={contactsColumns}
                data={filteredContacts}
                renderInlineItem={(row) => (
                  <>
                    {row.getValue('status') === ContactStatus.Awaiting ? (
                      <div className="grid grid-cols-2 items-center w-fit gap-4 ">
                        <ContactAcceptDialog row={row} />
                        <ContactRejectDialog row={row} />
                      </div>
                    ) : null}
                  </>
                )}
                renderItem={(row) => (
                  <>
                    <ViewDialog row={row} />
                    <ContactEditDialog row={row} />
                    {row.original.deletedAt == null && <ContactDeleteDialog row={row} />}
                  </>
                )}
                pagination={pagination}
                manualPagination={!!pagination}
              />
            </div>
            <div className="sm:hidden">
              <ContactsMobileList contacts={filteredContacts} pagination={pagination} manualPagination={!!pagination} />
            </div>
          </>
        ) : (
          <NoRecordsText message="No Contacts to show." />
        )}
      </CardContent>
    </Card>
  );
};
