import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  LoadingSpinner,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import { errorWrapper } from '@/utils';
import { Metadata } from '@bsv/spv-wallet-js-client';
import { QuestionMarkCircleIcon as Question } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react';

import { toast } from 'sonner';

export interface AddAccessKeyDialogProps {
  className?: string;
}

export const AddAccessKeyDialog = ({ className }: AddAccessKeyDialogProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [metadata, setMetadata] = useState(JSON.stringify({}));

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (metadata: Metadata) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.CreateAccessKey(metadata);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['accessKeys'],
      });
    },
  });

  const handleMetadataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadata(event.target.value);
  };

  const handleDialogOpen = () => {
    setIsAddDialogOpen((prev) => !prev);
  };

  const handleAdd = async () => {
    try {
      const metadataParsed = JSON.parse(metadata) as Metadata;
      mutation.mutate(metadataParsed);

      toast.success('Access key added');
      setMetadata(JSON.stringify({}));
      setIsAddDialogOpen(false);
    } catch (err) {
      errorWrapper(err);
      toast.error('Failed to add access key');
    }
  };

  const { isPending } = mutation;

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1">
          <CirclePlus className="mr-1" size={16} />
          Add Access Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Access Key</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <Label htmlFor="metadata">Metadata</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Question className="size-4 ml-1 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Metadata should be in JSON format. Example: {`{"key":"value"}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Textarea placeholder="Metadata" id="metadata" value={metadata} onChange={handleMetadataChange} />
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleAdd} disabled={isPending}>
            Add {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
          <Button variant="ghost" onClick={handleDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
