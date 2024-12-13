import { Metadata, Output } from '@bsv/spv-wallet-js-client';
import { ArchiveRestore } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

import { Textarea } from '@/components';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';

import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormProvider as Form } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface RecordTxDialogProps {
  className?: string;
}

export const PrepareTxDialogUser = ({ className }: RecordTxDialogProps) => {
  const [isPrepareDialogOpen, setIsPrepareDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();

  const queryClient = useQueryClient();

  const handleDialogToggle = () => {
    setIsPrepareDialogOpen((prev) => !prev);
    form.reset();
  };

  const mutation = useMutation({
    mutationFn: async ({ newRecipient, metadata }: { newRecipient: Output; metadata: Metadata }) =>
      await spvWalletClient?.SendToRecipients({ outputs: [newRecipient] }, metadata),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const formSchema = z.object({
    recipient: z.string().min(3).email('Invalid paymail'),
    amount: z.coerce.number().int().gte(1),
    metadata: z
      .string()
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      .transform((str, ctx): z.infer<ReturnType<any>> => {
        try {
          if (!str) {
            return null;
          }

          return JSON.parse(str);
        } catch (e) {
          ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
          return z.NEVER;
        }
      })
      .nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
      amount: 0,
      metadata: '',
    },
  });

  const onSubmit = async ({ recipient, amount, metadata }: z.infer<typeof formSchema>) => {
    try {
      const newRecipient: Output = { to: recipient, satoshis: amount };

      await mutation.mutateAsync({ newRecipient, metadata });

      setIsPrepareDialogOpen(false);

      toast.success('Transaction has been added');

      form.reset();
    } catch (err) {
      toast.error('Failed to prepare transaction');
      errorWrapper(err);
    }
  };

  return (
    <Dialog open={isPrepareDialogOpen} onOpenChange={handleDialogToggle}>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1 mr-3">
          <ArchiveRestore className="mr-1" size={16} />
          Prepare Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a prepared Transaction</DialogTitle>
          <DialogDescription>Create a prepared transaction using recipients and metadata</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input placeholder="paymail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is amount to transfer in satoshis</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='{ "exampleKey" : "example value" }' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
