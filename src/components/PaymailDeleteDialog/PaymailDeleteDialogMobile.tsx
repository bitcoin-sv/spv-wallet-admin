import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LoadingSpinner,
} from '@/components';
import { errorWrapper } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminApi } from '@/store/clientStore';

export interface PaymailDeleteDialogMobileProps {
  id: string;
}

export const PaymailDeleteDialogMobile = ({ id }: PaymailDeleteDialogMobileProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const adminApi = useAdminApi();
  const queryClient = useQueryClient();

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const deletePaymailMutation = useMutation({
    mutationFn: async (id: string) => {
      return await adminApi.deletePaymail(id);
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
    deletePaymailMutation.mutate(id);
  };

  const { isPending } = deletePaymailMutation;

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen}>
      <DialogTrigger className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
        Delete
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-32px)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete the paymail?</DialogTitle>
          <DialogDescription className="break-all font-bold">{id}</DialogDescription>
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
