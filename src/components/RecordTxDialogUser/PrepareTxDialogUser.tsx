import { Metadata, Recipient } from '@bsv/spv-wallet-js-client';
import { ArchiveRestore, CirclePlus } from 'lucide-react';

import { CircleX } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { Badge, Textarea } from '@/components';
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

interface RecordTxDialogProps {
  className?: string;
}

export const PrepareTxDialogUser = ({ className }: RecordTxDialogProps) => {
  const [recipient, setRecipient] = useState<string>('');
  const [isPrepareDialogOpen, setIsPrepareDialogOpen] = useState(false);
  const [recipientsBadges, setRecipientsBadges] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [metadata, setMetadata] = useState(JSON.stringify({}));

  const { spvWalletClient } = useSpvWalletClient();

  const handleDialogToggle = () => {
    setIsPrepareDialogOpen((prev) => !prev);
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadata(e.target.value);
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const convertedNumber = Number(e.target.value);
      if (convertedNumber) {
        setAmount(convertedNumber.toString());
      }
    } catch (err) {
      console.error(err);
      toast.warning('Amount should be a number');
    }
  };

  const handleSubmit = async () => {
    try {
      const parsedMetadata = JSON.parse(metadata) as Metadata;
      const recipients: Recipient[] = [];

      for (const rec of recipientsBadges) {
        const newRecipient: Recipient = { to: '', satoshis: 0 };
        newRecipient.to = rec;
        newRecipient.satoshis = Number(amount);
        recipients.push(newRecipient);
      }

      await spvWalletClient?.DraftToRecipients(recipients, parsedMetadata);

      setIsPrepareDialogOpen(false);
      toast.success('Transaction has been added');
    } catch (err) {
      toast.error('Failed to prepare transaction');
      errorWrapper(err);
    }
  };

  const handleAddRecipient = () => {
    setRecipientsBadges((prev) => [...prev, recipient]);
    setRecipient('');
  };

  const handleRemoveRecipient = (e: React.MouseEvent) => {
    const target = e.target as HTMLSpanElement;
    const selectedRecipient = target.parentElement?.innerText;
    const foundRecID = recipientsBadges.indexOf(selectedRecipient!);
    const updatedRecipients = recipientsBadges.toSpliced(foundRecID, 1);

    setRecipientsBadges(updatedRecipients);
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRecipient();
    }
  };

  useEffect(() => {
    setRecipient('');
    setRecipientsBadges([]);
    setAmount('');
    setMetadata(JSON.stringify({}));
  }, [isPrepareDialogOpen]);

  return (
    <Dialog open={isPrepareDialogOpen} onOpenChange={handleDialogToggle}>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1 mr-3">
          <ArchiveRestore className="mr-1" size={16} />
          Prepare Transaction
        </Button>
      </DialogTrigger>
      <DialogContent onKeyDown={handleEnterPress} className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a prepared Transaction</DialogTitle>
          <DialogDescription>Create a prepared transaction using recipients and metadata</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-centerite gap-4">
            <div className="flex flex-wrap items-center">
              <span className="mr-3">Recipients:</span>
              {recipientsBadges.map((recipient) => (
                <Badge key={recipient} className="mr-2 my-1 text-base cursor-pointer hover:bg-muted" variant="outline">
                  {recipient} <CircleX onClick={handleRemoveRecipient} className="ml-2" size={16} />
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-[5fr_1fr] w-full gap-4">
              <Input
                id="hex"
                placeholder="example@paymail.com"
                value={recipient}
                onChange={handleRecipientChange}
                className=""
              />
              <Button variant="secondary" onClick={handleAddRecipient}>
                <CirclePlus className="mr-3" />
                Add Recipient
              </Button>
            </div>
          </div>
          <div className="grid items-centerite gap-4">
            <Label htmlFor="amount">Amount</Label>
            <Input value={amount} id="amount" placeholder="Satoshis" onChange={handleAmountChange} />
          </div>
          <div className="grid items-centerite gap-4">
            <Label htmlFor="metadata">Metadata</Label>
            <Textarea placeholder="Metadata" id="metadata" value={metadata} onChange={handleMetadataChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
