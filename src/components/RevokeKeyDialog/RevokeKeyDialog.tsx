import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  LoadingSpinner,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';
import { AccessKey } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { toast } from 'sonner';

export interface RevokeKeyDialogProps {
  row: Row<AccessKey>;
}

export const RevokeKeyDialog = ({ row }: RevokeKeyDialogProps) => {
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

  const { spvWalletClient } = useSpvWalletClient();
  const queryClient = useQueryClient();
  const handleRevokeDialogOpen = () => {
    setIsRevokeDialogOpen((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.RevokeAccessKey(row.original.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['accessKeys'],
      });
      toast.success('Access key revoked');
    },
    onError: () => {
      toast.error('Error revoking access key');
    },
  });

  const handleRevokeAccessKey = () => {
    mutation.mutate();
    setIsRevokeDialogOpen(false);
  };

  const { isPending } = mutation;
  return (
    <Dialog open={isRevokeDialogOpen} onOpenChange={handleRevokeDialogOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Revoke</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Are you sure you want to <u>revoke</u> selected access key?</DialogTitle>
          <DialogDescription className="break-all font-bold text-xs">
            Access key ID:<br/>
            {row.original.id}
          </DialogDescription>
          <DialogDescription>
            This action cannot be undone. Please confirm your decision to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleRevokeAccessKey} disabled={isPending}>
            Revoke {isPending && <LoadingSpinner className="ml-2" />}
          </Button>
          <Button variant="ghost" onClick={handleRevokeDialogOpen}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
