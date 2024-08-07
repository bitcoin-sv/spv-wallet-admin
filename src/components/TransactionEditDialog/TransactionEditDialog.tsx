import { Metadata, Tx } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import React, { useState } from 'react';

import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  Label,
  Textarea,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';

export interface TransactionEditDialogProps {
  row: Row<Tx>;
}

export const TransactionEditDialog = ({ row }: TransactionEditDialogProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [metadata, setMetadata] = useState(JSON.stringify(row.original.metadata || {}));

  const { spvWalletClient } = useSpvWalletClient();

  const queryClient = useQueryClient();

  const handleMetadataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadata(event.target.value);
  };

  const mutation = useMutation({
    mutationFn: async (metadata: Metadata) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.UpdateTransactionMetadata(row.original.id, metadata);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
  });

  const handleEdit = async () => {
    try {
      const metadataParsed = JSON.parse(metadata) as Metadata;
      mutation.mutate(metadataParsed);

      toast.success('Transaction edited');
      setMetadata(JSON.stringify({}));
      setIsEditDialogOpen(false);
    } catch (err) {
      errorWrapper(err);
      toast.error('Failed to edit transaction');
    }
  };

  const handleEditDialogToggle = () => {
    setIsEditDialogOpen((prev) => !prev);
  };
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogToggle}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction Information</DialogTitle>
        </DialogHeader>
        <Label htmlFor="metadata">Metadata</Label>
        <Textarea placeholder="Metadata" id="metadata" value={metadata} onChange={handleMetadataChange} />
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="ghost" onClick={handleEditDialogToggle}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
