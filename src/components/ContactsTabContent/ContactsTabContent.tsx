import {
  ActionComponent,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  contactsColumns,
  DataTable,
  NoRecordsText,
} from '@/components';
import { ContactExtended } from '@/interfaces/contacts.ts';

export interface ContactsTabContentProps {
  contacts: ContactExtended[];
  actions: ActionComponent<ContactExtended>[];
  inlineActions?: ActionComponent<ContactExtended>[];
}

export const ContactsTabContent = ({ contacts, actions, inlineActions }: ContactsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {contacts.length > 0 ? (
          <DataTable columns={contactsColumns} data={contacts} actions={actions} inlineActions={inlineActions} />
        ) : (
          <NoRecordsText message="No Contacts to show." />
        )}
      </CardContent>
    </Card>
  );
};
