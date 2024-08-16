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

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

interface AddXpubDialogProps {
  className?: string;
}

export const AddXpubDialog = ({ className }: AddXpubDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [xPriv, setXPriv] = useState<string>('');
  const [xPub, setXPub] = useState<string>('');
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

  const handleXPubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXPub(event.target.value);
  };

  useEffect(() => {
    if (!xPriv) return;

    try {
      const xPrivHD = HD.fromString(xPriv);
      const xPubString = xPrivHD.toPublic().toString();
      setXPub(xPubString);
      toast.success('Converted xPriv to xPub');
    } catch (error) {
      toast.error('Unable to convert xPriv to xPub');
      setXPub('');
    }
  }, [xPriv]);

  useEffect(() => {
    setXPriv('');
  }, [xPub]);

  const handeDialogToggle = () => {
    setIsOpen((prev) => !prev);
    setXPriv('');
    setXPub('');
  };

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
    <Dialog open={isOpen} onOpenChange={handeDialogToggle}>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1">
          <CirclePlus className="mr-1" size={16} />
          Add xPub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add xPub</DialogTitle>
          <DialogDescription>Get xpub from xpriv</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[1fr_10fr] items-center gap-4">
            <Label htmlFor="xPriv" className="text-right">
              xPriv
            </Label>
            <Input id="xPriv" placeholder="xprv..." value={xPriv} onChange={handleXPrivChange} />
          </div>
          <div className="flex justify-center text-gray-400 text-xs">Or put xpub directly</div>

          <div className="grid grid-cols-[1fr_10fr] items-center gap-4">
            <Label htmlFor="xPub" className="text-right">
              xPub
            </Label>
            <Input id="xPub" value={xPub} onChange={handleXPubChange} placeholder="xpub..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Add xPub</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
