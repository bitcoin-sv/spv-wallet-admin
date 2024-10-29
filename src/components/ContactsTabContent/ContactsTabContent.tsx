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
import { ContactExtended } from '@/interfaces/contacts.ts';

export interface ContactsTabContentProps {
  contacts: ContactExtended[];
}

export const ContactsTabContent = ({ contacts }: ContactsTabContentProps) => {
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
          />
        ) : (
          <NoRecordsText message="No Contacts to show." />
        )}
      </CardContent>
    </Card>
  );
};
