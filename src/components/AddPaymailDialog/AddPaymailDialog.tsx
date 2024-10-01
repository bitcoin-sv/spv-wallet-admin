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
import { errorWrapper } from '@/utils';
import { HD } from '@bsv/sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus } from 'lucide-react';

import React, { useState } from 'react';

import { toast } from 'sonner';

interface AddPaymailDialogProps {
  className?: string;
}

export const AddPaymailDialog = ({ className }: AddPaymailDialogProps) => {
  const [xPub, setXPub] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [publicName, setPublicName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');

  const queryClient = useQueryClient();

  const { spvWalletClient } = useSpvWalletClient();

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
      return await spvWalletClient!.AdminCreatePaymail(xPub, address, publicName, avatar);
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const handleXPubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXPub(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handlePublicNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicName(event.target.value);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(event.target.value);
  };

  const onSubmit = async () => {
    if (!xPub || !address || !publicName || !avatar) {
      return;
    }

    try {
      HD.fromString(xPub);
      await mutation.mutateAsync({
        xPub,
        address,
        publicName,
        avatar,
      });
      toast.success('Added Paymail');
      setXPub('');
      setAddress('');
      setPublicName('');
      setAvatar('');
    } catch (error) {
      toast.error('Unable to add Paymail');
      errorWrapper(error);
    }
  };

  const { isPending } = mutation;
  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1">
          <CirclePlus className="mr-1" size={16} />
          Add Paymail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Paymail</DialogTitle>
          <DialogDescription>Register a new Paymail here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="xPub" className="text-right">
              xPub
            </Label>
            <Input id="xPub" placeholder="xpub..." value={xPub} onChange={handleXPubChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              placeholder="john@example.com"
              value={address}
              onChange={handleAddressChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public_name" className="text-right">
              Public Name
            </Label>
            <Input
              id="public_name"
              placeholder="John Doe"
              value={publicName}
              onChange={handlePublicNameChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar URL
            </Label>
            <Input
              id="avatar"
              placeholder="https://..."
              value={avatar}
              onChange={handleAvatarChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isPending}>
            Add Paymail {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
