import { CirclePlus } from 'lucide-react';
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
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import React, { useEffect, useState } from 'react';
import { HD } from '@bsv/sdk';
import { errorWrapper } from '@/utils';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSpvWalletClient } from '@/contexts';

export const AddXpubDialog = () => {
  const [xPriv, setXPriv] = useState<string>('');
  const [xPub, setXPub] = useState<string>('');
  const [debouncedXPriv] = useDebounce(xPriv, 500);
  const queryClient = useQueryClient();

  const { spvWalletClient } = useSpvWalletClient();

  const mutation = useMutation({
    mutationFn: async (xpub: string) => {
      // TypeScript thinks that spvWalletClient is not defined since the initial state is null. Tells TS that it is defined using !.
      return await spvWalletClient!.AdminNewXpub(xpub, {});
    },
  });

  const handleXPrivChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXPriv(event.target.value);
  };

  useEffect(() => {
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
      const data = await mutation.mutateAsync(xPub);
      queryClient.setQueryData(['xpubs'], (oldData: any) => [...oldData, data]);
      toast.success('Added xPub');
      setXPriv('');
      setXPub('');
    } catch (error) {
      console.log('error', error);
      toast.error('Unable to add xPub');
      errorWrapper(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <CirclePlus className="mr-2" size={16} />
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
