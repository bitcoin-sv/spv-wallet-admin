import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { Webhook } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { CircleMinus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UnsubscribeWebhookProps {
  row: Row<Webhook>;
}

export const UnsubscribeWebhook = ({ row }: UnsubscribeWebhookProps) => {
  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpenToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminDeleteWebhook(url);
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const onRemove = () => {
    mutation.mutate(row.original.url, {
      onSuccess: () => {
        toast.success('Webhook unsubscribed');
      },
      onError: (error) => {
        toast.error('Failed to unsubscribe webhook');
        errorWrapper(error);
      },
    });
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleIsOpenToggle}>
        <DialogTrigger asChild className="w-full">
          <Button variant="destructive" className="h-8 max-w-min">
            <CircleMinus className="w-4 h-4 mr-2" /> Unsubscribe
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsubscribe webhook</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to unsubscribe a <span className="font-bold text-black">{row.getValue('url')}</span>{' '}
            webhook ?
          </DialogDescription>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={onRemove}>Unsubscribe</Button>
            <Button variant="ghost" onClick={handleIsOpenToggle}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
