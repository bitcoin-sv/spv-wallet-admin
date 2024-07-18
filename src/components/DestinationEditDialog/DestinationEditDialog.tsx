import { Metadata } from '@bsv/spv-wallet-js-client';
import { useQueryClient } from '@tanstack/react-query';
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

export interface DestinationEditDialogProps {
  row: Row<any>;
}

export const DestinationEditDialog = ({ row }: DestinationEditDialogProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [metadata, setMetadata] = useState(JSON.stringify(row.original.metadata || {}));

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen((prev) => !prev);
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadata(e.target.value);
  };

  const handleEdit = async () => {
    try {
      const metadataParsed = JSON.parse(metadata) as Metadata;

      await spvWalletClient?.UpdateDestinationMetadataByID(row.original.id, metadataParsed);
      await queryClient.invalidateQueries();

      toast.success('Destination metadata updated');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update destination metadata');
      errorWrapper(error);
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Destination Metadata</DialogTitle>
        </DialogHeader>
        <Label htmlFor="metadata">Metadata</Label>
        <Textarea placeholder="Metadata" id="metadata" value={metadata} onChange={handleMetadataChange} />
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="ghost" onClick={handleEditDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
