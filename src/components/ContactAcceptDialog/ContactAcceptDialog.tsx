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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { Contact } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { UserRoundCheck } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

export interface ContactAcceptDialogProps {
  row: Row<Contact>;
}

export const ContactAcceptDialog = ({ row }: ContactAcceptDialogProps) => {
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();

  const queryClient = useQueryClient();

  const acceptContactMutation = useMutation({
    mutationFn: async (id: string) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminAcceptContact(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      setIsAcceptDialogOpen(false);
      toast.success('Contact accepted');
    },
    onError: (err) => {
      toast.error('Failed to accept contact');
      errorWrapper(err);
    },
  });

  const handleAcceptDialogOpen = () => {
    setIsAcceptDialogOpen((prev) => !prev);
  };

  const handleAcceptContact = () => {
    acceptContactMutation.mutate(row.original.id);
  };

  const { isPending } = acceptContactMutation;

  return (
    <Dialog open={isAcceptDialogOpen} onOpenChange={handleAcceptDialogOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90">
                <UserRoundCheck className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Accept Contact</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Are you sure you want to <u>accept</u> the contact?</DialogTitle>
          <DialogDescription className="break-all font-bold">
            {row.getValue('paymail')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleAcceptContact} disabled={isPending}>
            Accept {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
          <Button variant="outline" onClick={handleAcceptDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
