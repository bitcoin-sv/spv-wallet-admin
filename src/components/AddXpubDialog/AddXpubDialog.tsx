import { HD } from '@bsv/sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button.tsx';
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

interface AddXpubDialogProps {
  className?: string;
}

export const AddXpubDialog = ({ className }: AddXpubDialogProps) => {
  const [xPriv, setXPriv] = useState<string>('');
  const [xPub, setXPub] = useState<string>('');
  const [debouncedXPriv] = useDebounce(xPriv, 500);
  const queryClient = useQueryClient();

  const { spvWalletClient } = useSpvWalletClient();

  const mutation = useMutation({
    mutationFn: async (xpub: string) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminNewXpub(xpub, {});
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const handleXPrivChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXPriv(event.target.value);
  };

  useEffect(() => {
    setXPub('');
    if (!xPriv) return;

    try {
      const xPrivHD = HD.fromString(debouncedXPriv);
      const xPubString = xPrivHD.toPublic().toString();
      setXPub(xPubString);
      toast.success('Converted xPriv to xPub');
    } catch (error) {
      toast.error('Unable to convert xPriv to xPub');
      setXPub('');
    }
  }, [debouncedXPriv]);

  const onSubmit = async () => {
    if (!xPub) return;
    try {
      HD.fromString(xPub);
      await mutation.mutateAsync(xPub);
      toast.success('Added xPub');
      setXPriv('');
      setXPub('');
    } catch (error) {
      toast.error('Unable to add xPub');
      errorWrapper(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1">
          <CirclePlus className="mr-1" size={16} />
          Add xPub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add xPub</DialogTitle>
          <DialogDescription>Register a new xPub here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="xPriv" className="text-right">
              xPriv
            </Label>
            <Input id="xPriv" placeholder="xprv..." value={xPriv} onChange={handleXPrivChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="xPub" className="text-right">
              xPub
            </Label>
            <Input id="xPub" readOnly value={xPub} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Add xPub</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
