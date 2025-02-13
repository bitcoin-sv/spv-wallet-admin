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
import { errorWrapper } from '@/utils';
import { Metadata } from '@bsv/spv-wallet-js-client';
import { QuestionMarkCircleIcon as Question } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useUserApi } from '@/store/clientStore';

export interface AddAccessKeyDialogProps {
  className?: string;
}

const onClickCopy = async (accessKey: string | undefined) => {
  if (!accessKey) {
    return;
  }

  await navigator.clipboard.writeText(accessKey);
  toast.success(`Access Key copied to clipboard`);
};

export const AddAccessKeyDialog = ({ className }: AddAccessKeyDialogProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [metadata, setMetadata] = useState(JSON.stringify({}));
  const [accessKey, setAccessKey] = useState<string | undefined>(undefined);

  const userApi = useUserApi();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (metadata: Metadata) => {
      return await userApi.generateAccessKey(metadata);
    },
    onSuccess: (data) => {
      setAccessKey(data.key);
      toast.success('Access key added');
      setMetadata(JSON.stringify({}));
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
    if (accessKey) {
      setAccessKey(undefined);
    }
  };

  const handleAdd = async () => {
    try {
      const metadataParsed = JSON.parse(metadata) as Metadata;
      mutation.mutate(metadataParsed);
    } catch (err) {
      errorWrapper(err);
      toast.error('Failed to add access key');
    }
  };

  const { isPending } = mutation;

  const displayAccessKey = () => {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Save your access key</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col text-wrap overflow-hidden">
          We won't display your access key never again.
          <br />
          If you want to use it to login please save it somewhere secure.
          <div className="flex items-center pt-6">
            Your Access Key
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Question className="size-4 ml-1 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="pt-1 cursor-pointer" onClick={() => onClickCopy(accessKey)}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="truncate border border-black rounded-md p-2 bg-gray-100">{accessKey}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{accessKey}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1">
          <CirclePlus className="mr-1" size={16} />
          Add Access Key
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        {accessKey ? (
          displayAccessKey()
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
