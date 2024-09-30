import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  LoadingSpinner,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { PaymailAddress } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { toast } from 'sonner';

export interface PaymailDeleteDialogProps {
  row: Row<PaymailAddress>;
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

  const deletePaymailMutation = useMutation({
    mutationFn: async (address: string) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminDeletePaymail(address);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('Paymail successfully deleted');
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to delete paymail');
      errorWrapper(error);
    },
  });

  const handleDelete = () => {
    deletePaymailMutation.mutate(address);
  };

  const { isPending } = deletePaymailMutation;

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
