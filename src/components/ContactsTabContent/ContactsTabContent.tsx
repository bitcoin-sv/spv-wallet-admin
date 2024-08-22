import { Card, CardContent, CardHeader, CardTitle, contactsColumns, DataTable, NoRecordsText } from '@/components';
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
          <DataTable columns={contactsColumns} data={contacts} />
        ) : (
          <NoRecordsText message="No Contacts to show." />
        )}
      </CardContent>
    </Card>
  );
};
