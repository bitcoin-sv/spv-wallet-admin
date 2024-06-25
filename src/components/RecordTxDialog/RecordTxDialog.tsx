import { QuestionMarkCircleIcon as Question } from '@heroicons/react/24/outline';
import { ArchiveRestore } from 'lucide-react';

import React, { useState } from 'react';

import { toast } from 'sonner';

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';

interface RecordTxDialogProps {
  className?: string;
}

export const RecordTxDialog = ({ className }: RecordTxDialogProps) => {
  const [hexOrId, setHexOrId] = useState<string>('');
  const { spvWalletClient } = useSpvWalletClient();

  const handleHexOrIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHexOrId(event.target.value);
  };

  const onSubmit = async () => {
    if (!hexOrId) return;
    try {
      if (hexOrId.length === 64) {
        const response: any = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${hexOrId}/hex`);
        const hex = await response.text();
        await spvWalletClient!.AdminRecordTransaction(hex);

        toast.success('Recorded Transaction');
        setHexOrId('');
        return;
      } else if (hexOrId.length > 64) {
        await spvWalletClient!.AdminRecordTransaction(hexOrId);
        toast.success('Recorded Transaction');

        setHexOrId('');
        return;
      } else {
        toast.error('Unable to record Transaction');
        return;
      }
    } catch (error) {
      toast.error('Unable to record Transaction');
      errorWrapper(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1 mr-3">
          <ArchiveRestore className="mr-1" size={16} />
          Record Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Record Transaction</DialogTitle>
          <DialogDescription>Record a new transaction here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-centerite gap-4">
            <Label htmlFor="hex" className="flex">
              Transaction Hex or ID
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Question className="size-4 ml-1 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      You can record transactions using either the transaction hex or transaction ID; if you use the ID,
                      the hex will be fetched automatically.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="hex"
              placeholder="039ef..."
              value={hexOrId}
              onChange={handleHexOrIdChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Record Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
