import { Contact } from '@bsv/spv-wallet-js-client';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ContactStatus } from './ContactsColumns';
import { ContactAcceptDialog, ContactRejectDialog, ContactEditDialog, ContactDeleteDialog } from '@/components';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewDialogMobile } from '@/components/ViewDialog/ViewDialogMobile';
import { Row } from '@tanstack/react-table';
import { truncateId } from '@/utils/string';
import { MobileDataTable } from '@/components/DataTable/MobileDataTable';
import { PaginationProps } from '@/components/DataTable/DataTable';

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

interface ContactMobileItemProps {
  contact: Contact;
  expandedState?: { expandedItems: string[]; setExpandedItems: (value: string[]) => void };
}

export const ContactMobileItem = ({ contact }: ContactMobileItemProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (contact.deletedAt) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    switch (contact.status) {
      case ContactStatus.Confirmed:
        return <Badge variant="outline">Confirmed</Badge>;
      case ContactStatus.Rejected:
        return <Badge variant="secondary">Rejected</Badge>;
      case ContactStatus.Unconfirmed:
        return <Badge variant="secondary">Unconfirmed</Badge>;
      case ContactStatus.Awaiting:
        return <Badge>Awaiting</Badge>;
      default:
        return null;
    }
  };

  const mobileRow: Row<Contact> = {
    original: contact,
    getValue: (key: 'paymail' | 'status'): string | undefined => contact[key],
  } as Row<Contact>;

  return (
    <AccordionItem value={contact.id} className="px-2">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 space-y-1 text-left">
            <p className="text-sm font-medium leading-none flex items-center gap-2">
              <span className="shrink-0">Name:</span>
              <span className="truncate">{truncateId(contact.paymail)}</span>
            </p>
            <div className="text-sm text-muted-foreground">{getStatusBadge()}</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium">ID:</span>
            <span className="cursor-pointer truncate" onClick={onClickCopy(contact.id, 'ID')}>
              {contact.id}
            </span>

            {contact.fullName && (
              <>
                <span className="font-medium">Full Name:</span>
                <span>{contact.fullName}</span>
              </>
            )}

            {contact.paymail && (
              <>
                <span className="font-medium">Paymail:</span>
                <span className="cursor-pointer truncate" onClick={onClickCopy(contact.paymail, 'Paymail')}>
                  {contact.paymail}
                </span>
              </>
            )}

            {contact.pubKey && (
              <>
                <span className="font-medium">PubKey:</span>
                <span className="cursor-pointer truncate" onClick={onClickCopy(contact.pubKey, 'PubKey')}>
                  {contact.pubKey}
                </span>
              </>
            )}

            <span className="font-medium">Created:</span>
            <span>{formatDate(new Date(contact.createdAt))}</span>
          </div>

          {contact.status === ContactStatus.Awaiting && (
            <div className="grid grid-cols-2 items-center gap-4">
              <ContactAcceptDialog row={mobileRow} />
              <ContactRejectDialog row={mobileRow} />
            </div>
          )}

          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <ViewDialogMobile data={contact} />
                </DropdownMenuItem>
                <ContactEditDialog row={mobileRow} />
                {contact.deletedAt == null && <ContactDeleteDialog row={mobileRow} />}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export interface ContactsMobileListProps {
  contacts: Contact[];
  pagination?: PaginationProps;
}

export const ContactsMobileList = ({ contacts, pagination }: ContactsMobileListProps) => {
  // Use MobileDataTable for pagination support
  return (
    <MobileDataTable
      data={contacts}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
      ]}
      renderMobileItem={(item: Contact, expandedState) => (
        <ContactMobileItem contact={item} expandedState={expandedState} />
      )}
      pagination={pagination}
    />
  );
};
