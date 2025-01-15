import { LoadingSpinner } from '@/components';

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
import { Label } from '@/components/ui/label.tsx';
import { useSpvWalletClient } from '@/contexts';
import { HD } from '@bsv/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus } from 'lucide-react';

import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { KEY_LENGTH } from '@/constants';
import { toast } from 'sonner';

interface AddPaymailDialogProps {
  className?: string;
}

const addPaymailFormSchema = z.object({
  xPub: z
    .string({ required_error: 'xPub is required' })
    .min(1, 'xPub is required')
    .refine((val) => val.startsWith('xpub'), 'xPub should start with xpub')
    .refine((val) => val.length === KEY_LENGTH, 'Invalid xPriv length.'),
  paymail: z
    .string({ required_error: 'Paymail is required' })
    .min(1, 'Paymail is required')
    .email('Invalid paymail format'),
  publicName: z.string().default(''),
  avatar: z.string().default(''),
});

export const AddPaymailDialog = ({ className }: AddPaymailDialogProps) => {
  const queryClient = useQueryClient();

  const { spvWalletClient } = useSpvWalletClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof addPaymailFormSchema>>({
    resolver: zodResolver(addPaymailFormSchema),
  });

  const mutation = useMutation({
    mutationFn: async ({
      xPub,
      address,
      publicName,
      avatar,
    }: {
      xPub: string;
      address: string;
      publicName: string;
      avatar: string;
    }) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminCreatePaymail(xPub, address, publicName, avatar, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      reset();
    },
  });

  const onSubmit = async ({ avatar, paymail, xPub, publicName }: z.infer<typeof addPaymailFormSchema>) => {
    try {
      HD.fromString(xPub);
      await mutation.mutateAsync({
        xPub,
        address: paymail,
        publicName,
        avatar,
      });
      toast.success('Added Paymail');
    } catch (error) {
      console.error(error);
      toast.error('Unable to add Paymail');
    }
  };

  const { isPending } = mutation;

  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1" onClick={() => reset()}>
          <CirclePlus className="mr-1" size={16} />
          Add Paymail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Paymail</DialogTitle>
          <DialogDescription>Register a new Paymail here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center">
              <Label htmlFor="xPub" className="text-right pr-4">
                xPub
              </Label>
              <Input id="xPub" placeholder="xpub..." className="col-span-3" {...register('xPub')} />
              <span className="text-red-600 text-xs col-span-3 col-start-2 pt-1">{errors.xPub?.message}</span>
            </div>
            <div className="grid grid-cols-4 items-center">
              <Label htmlFor="address" className="text-right pr-4">
                Address
              </Label>
              <Input id="paymail" placeholder="john@example.com" className="col-span-3" {...register('paymail')} />
              <span className="text-red-600 text-xs col-span-3 col-start-2 pt-1">{errors.paymail?.message}</span>
            </div>
            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="publicName" className="text-right pr-4">
                Public Name
              </Label>
              <Input id="publicName" placeholder="John Doe" className="col-span-3" {...register('publicName')} />
            </div>
            <div className="grid grid-cols-4 items-center">
              <Label htmlFor="avatar" className="text-right pr-4">
                Avatar URL
              </Label>
              <Input id="avatar" placeholder="https://..." className="col-span-3" {...register('avatar')} />
              <span className="text-red-600 text-xs col-span-3 col-start-2 pt-1">{errors.avatar?.message}</span>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Add Paymail {isPending && <LoadingSpinner className="ml-2" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
