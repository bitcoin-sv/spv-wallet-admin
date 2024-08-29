import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu.tsx';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { Contact } from '@bsv/spv-wallet-js-client';

export interface ContactDeleteDialogProps {
  row: Row<Contact>;
}

export const ContactDeleteDialog = ({ row }: ContactDeleteDialogProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await spvWalletClient?.AdminDeleteContact(row.original.id);
      await queryClient.invalidateQueries();

      toast.success('Contact deleted');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete contact');
      errorWrapper(error);
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {row.original.paymail} contact?</DialogTitle>
          <DialogDescription>This action cannot be undone. Please confirm your decision to proceed.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="ghost" onClick={handleDeleteDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
