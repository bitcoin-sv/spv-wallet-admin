import { LoadingSpinner } from '@/components';

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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { toast } from 'sonner';

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminDeleteContact(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('Contact deleted');
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to delete contact');
      errorWrapper(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(row.original.id);
  };

  const { isPending } = deleteMutation;

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete the contact?</DialogTitle>
          <DialogDescription className="break-all font-bold">
            {row.original.paymail}
          </DialogDescription>
          <DialogDescription>This action cannot be undone. Please confirm your decision to proceed.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            Delete {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
          <Button variant="ghost" onClick={handleDeleteDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
