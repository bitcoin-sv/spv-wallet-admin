import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LoadingSpinner,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';

import { errorWrapper } from '@/utils';
import { Contact } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { UserRoundX } from 'lucide-react';

import { useState } from 'react';

import { toast } from 'sonner';
import { useAdminApi } from '@/store/clientStore';

export interface ContactRejectDialogProps {
  row: Row<Contact>;
}

export const ContactRejectDialog = ({ row }: ContactRejectDialogProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const adminApi = useAdminApi();
  const queryClient = useQueryClient();

  const handleRejectDialogOpen = () => {
    setIsRejectDialogOpen((prev) => !prev);
  };

  const rejectContactMutation = useMutation({
    mutationFn: async (id: string) => {
      return await adminApi.rejectInvitation(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      setIsRejectDialogOpen(false);
      toast.success('Contact rejected');
    },
    onError: (err) => {
      toast.error('Failed to reject contact');
      errorWrapper(err);
    },
  });

  const handleRejectContact = () => {
    rejectContactMutation.mutate(row.original.id);
  };

  const { isPending } = rejectContactMutation;

  return (
    <Dialog open={isRejectDialogOpen} onOpenChange={handleRejectDialogOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="h-10 w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                <UserRoundX className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Reject Contact</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to <u>reject</u> the contact?
          </DialogTitle>
          <DialogDescription className="break-all font-bold">{row.getValue('paymail')}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleRejectContact} disabled={isPending}>
            Reject {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
          <Button variant="outline" onClick={handleRejectDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
