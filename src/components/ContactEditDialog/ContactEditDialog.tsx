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
  Input,
  Label,
  Textarea,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';

export interface ContactEditDialogProps {
  row: Row<any>;
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

  const handleEdit = async () => {
    try {
      const metadataParsed = JSON.parse(metadata) as Metadata;

      await spvWalletClient?.AdminUpdateContact(row.original.id, fullName, metadataParsed);
      await queryClient.invalidateQueries();

      toast.success('Contact updated');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update contact');
      errorWrapper(error);
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadata(e.target.value);
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
          <DialogTitle>Edit Contact Information</DialogTitle>
        </DialogHeader>
        <Label htmlFor="fullName">Full Name</Label>
        <Input placeholder="Full Name" id="fullName" value={fullName} onChange={handleFullNameChange} />
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
