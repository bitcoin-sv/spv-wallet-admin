import { Contact } from '@bsv/spv-wallet-js-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ContactStatus } from './ContactsColumns';
import { ContactAcceptDialog, ContactRejectDialog, ContactEditDialog, ContactDeleteDialog } from '@/components';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewDialogMobile } from '@/components/ViewDialog/ViewDialogMobile';
import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { MobileDataTablePagination } from '@/components/DataTable/MobileDataTablePagination';
import { truncateId } from '@/utils/string';

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

interface ContactMobileItemProps {
  contact: Contact;
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
    getValue: (key: string) => {
      if (key === 'paymail') {
        return contact.paymail;
      }
      if (key === 'status') {
        return contact.status;
      }
      return undefined;
    },
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
            <p className="text-sm text-muted-foreground">{getStatusBadge()}</p>
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
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export const ContactsMobileList = ({ contacts, value, onValueChange }: ContactsMobileListProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(value || []);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const table = useReactTable({
    data: contacts,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const currentPageData = table.getRowModel().rows.map((row) => row.original);

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedItems([]);
      onValueChange?.([]);
    } else {
      const ids = currentPageData.map((contact) => contact.id);
      setExpandedItems(ids);
      onValueChange?.(ids);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const handleValueChange = (newValue: string[]) => {
    setExpandedItems(newValue);
    onValueChange?.(newValue);
    setIsAllExpanded(newValue.length === currentPageData.length);
  };

  return (
    <div className="rounded-md border">
      <div className="p-2 border-b">
        <Button variant="ghost" onClick={toggleExpandAll} className="w-full flex items-center justify-center gap-2">
          {isAllExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Expand All
            </>
          )}
        </Button>
      </div>
      <div className="p-1">
        <Accordion type="multiple" value={expandedItems} onValueChange={handleValueChange} className="w-full">
          {currentPageData.map((contact) => (
            <ContactMobileItem key={contact.id} contact={contact} />
          ))}
        </Accordion>
      </div>
      <MobileDataTablePagination table={table} />
    </div>
  );
};
