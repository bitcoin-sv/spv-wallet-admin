import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components';
import { errorWrapper } from '@/utils';
import { Webhook } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { CircleMinus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminApi } from '@/store/clientStore';

interface UnsubscribeWebhookProps {
  row: Row<Webhook>;
}

export const UnsubscribeWebhook = ({ row }: UnsubscribeWebhookProps) => {
  const adminApi = useAdminApi();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpenToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      return await adminApi.unsubscribeWebhook(url);
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
            <DialogTitle>Are you sure you want to unsubscribe a webhook ?</DialogTitle>
          </DialogHeader>
          <DialogDescription className="break-all font-bold text-xs">{row.original.url}</DialogDescription>
          <DialogDescription>This action cannot be undone. Please confirm your decision to proceed.</DialogDescription>
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
