import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  Input,
  Label,
  LoadingSpinner,
  Textarea,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { Contact, Metadata } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import React, { useState } from 'react';

import { toast } from 'sonner';

export interface ContactEditDialogProps {
  row: Row<Contact>;
}

export const ContactEditDialog = ({ row }: ContactEditDialogProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [fullName, setFullName] = useState(row.original.fullName);
  const [metadata, setMetadata] = useState(JSON.stringify(row.original.metadata || {}));

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen((prev) => !prev);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, fullName, metadata }: { id: string; fullName: string; metadata: string }) => {
      const metadataParsed = JSON.parse(metadata) as Metadata;
      return await spvWalletClient!.AdminUpdateContact(id, fullName, metadataParsed);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('Contact updated');
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update contact');
      errorWrapper(error);
    },
  });

  const handleEdit = () => {
    editMutation.mutate({ id: row.original.id, fullName, metadata });
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadata(e.target.value);
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
          <DialogTitle>Edit Contact Information</DialogTitle>
        </DialogHeader>
        <Label htmlFor="fullName">Full Name</Label>
        <Input placeholder="Full Name" id="fullName" value={fullName} onChange={handleFullNameChange} />
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
