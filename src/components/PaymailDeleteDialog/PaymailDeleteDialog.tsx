import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';

export interface PaymailDeleteDialogProps {
  row: Row<any>;
}

export const PaymailDeleteDialog = ({ row }: PaymailDeleteDialogProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();

  const { alias, domain } = row.original;
  const address = `${alias}@${domain}`;

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await spvWalletClient?.AdminDeletePaymail(address);
      await queryClient.invalidateQueries();
      toast.success('Paymail successfully deleted');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete paymail');
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
          <DialogTitle>Are you sure you want to delete {address} paymail?</DialogTitle>
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
