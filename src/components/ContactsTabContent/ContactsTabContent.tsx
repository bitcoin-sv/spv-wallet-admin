import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ContactAcceptDialogProps,
  ContactDeleteDialogProps,
  ContactEditDialogProps,
  ContactRejectDialogProps,
  contactsColumns,
  DataTable,
  NoRecordsText,
} from '@/components';
import { ContactExtended } from '@/interfaces/contacts.ts';

export interface ContactsTabContentProps {
  contacts: ContactExtended[];
  ContactEditDialog?: React.ComponentType<ContactEditDialogProps>;
  AcceptDialog?: React.ComponentType<ContactAcceptDialogProps>;
  DeleteDialog?: React.ComponentType<ContactDeleteDialogProps>;
  RejectDialog?: React.ComponentType<ContactRejectDialogProps>;
}

export const ContactsTabContent = ({
  contacts,
  ContactEditDialog,
  AcceptDialog,
  DeleteDialog,
  RejectDialog,
}: ContactsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {contacts.length > 0 ? (
          <DataTable
            columns={contactsColumns}
            data={contacts}
            AcceptDialog={AcceptDialog}
            ContactEditDialog={ContactEditDialog}
            DeleteDialog={DeleteDialog}
            RejectDialog={RejectDialog}
          />
        ) : (
          <NoRecordsText message="No Contacts to show." />
        )}
      </CardContent>
    </Card>
  );
};
