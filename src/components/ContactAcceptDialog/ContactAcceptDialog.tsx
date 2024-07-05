import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { UserRoundCheck } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button.tsx';
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

export interface ContactAcceptDialogProps {
  row: Row<any>;
}

export const ContactAcceptDialog = ({ row }: ContactAcceptDialogProps) => {
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();

  const queryClient = useQueryClient();

  const handleAcceptDialogOpen = () => {
    setIsAcceptDialogOpen((prev) => !prev);
  };

  const handleAcceptContact = async () => {
    try {
      await spvWalletClient?.AdminAcceptContact(row.original.id);
      await queryClient.invalidateQueries();
      setIsAcceptDialogOpen(false);
      toast.success('Contact accepted');
    } catch (err) {
      toast.error('Failed accept contact');
      errorWrapper(err);
    }
  };
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
          <DialogTitle>Accept Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to accept <span className="font-bold text-black">{row.getValue('paymail')}</span> as a
            contact ?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleAcceptContact}>Accept</Button>
          <Button variant="outline" onClick={handleAcceptDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
