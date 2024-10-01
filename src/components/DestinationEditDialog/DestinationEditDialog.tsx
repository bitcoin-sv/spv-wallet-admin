import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  Label,
  LoadingSpinner,
  Textarea,
} from '@/components';

import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { Destination, Metadata } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import React, { useState } from 'react';

import { toast } from 'sonner';

export interface DestinationEditDialogProps {
  row: Row<Destination>;
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

  const editMutation = useMutation({
    mutationFn: async ({ id, metadata }: { id: string; metadata: string }) => {
      const metadataParsed = JSON.parse(metadata) as Metadata;
      await spvWalletClient?.UpdateDestinationMetadataByID(id, metadataParsed);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('Destination metadata updated');
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update destination metadata');
      errorWrapper(error);
    },
  });

  const handleEdit = () => {
    editMutation.mutate({ id: row.original.id, metadata });
  };

  const { isPending } = editMutation;

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
          <Button onClick={handleEdit} disabled={isPending}>
            Edit {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
          <Button variant="ghost" onClick={handleEditDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
