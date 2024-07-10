import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { UserRoundX } from 'lucide-react';

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import { errorWrapper } from '@/utils';

export interface ContactRejectDialogProps {
  row: Row<any>;
}

export const ContactRejectDialog = ({ row }: ContactRejectDialogProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();

  const handleRejectDialogOpen = () => {
    setIsRejectDialogOpen((prev) => !prev);
  };

  const handleRejectContact = async () => {
    try {
      await spvWalletClient?.AdminRejectContact(row.original.id);
      await queryClient.invalidateQueries();
      setIsRejectDialogOpen(false);
      toast.success('Contact rejected');
    } catch (err) {
      toast.error('Failed to reject contact');
      errorWrapper(err);
    }
  };

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
          <DialogTitle>Reject Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject <span className="font-bold text-black">{row.getValue('paymail')}</span> as a
            contact ?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleRejectContact}>
            Reject
          </Button>
          <Button variant="outline" onClick={handleRejectDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
