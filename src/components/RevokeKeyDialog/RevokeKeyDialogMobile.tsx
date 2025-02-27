import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LoadingSpinner,
} from '@/components';
import { errorWrapper } from '@/utils';
import { AccessKey } from '@bsv/spv-wallet-js-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUserApi } from '@/store/clientStore';

export interface RevokeKeyDialogMobileProps {
  accessKey: AccessKey;
}

export const RevokeKeyDialogMobile = ({ accessKey }: RevokeKeyDialogMobileProps) => {
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const userApi = useUserApi();
  const queryClient = useQueryClient();

  const handleRevokeDialogOpen = () => {
    setIsRevokeDialogOpen((prev) => !prev);
  };

  const revokeKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await userApi.revokeAccessKey(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('Access key successfully revoked');
      setIsRevokeDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to revoke access key');
      errorWrapper(error);
    },
  });

  const handleRevoke = () => {
    revokeKeyMutation.mutate(accessKey.id);
  };

  const { isPending } = revokeKeyMutation;

  return (
    <Dialog open={isRevokeDialogOpen} onOpenChange={handleRevokeDialogOpen}>
      <DialogTrigger className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
        Revoke
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-32px)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Are you sure you want to revoke the access key?</DialogTitle>
          <DialogDescription className="break-all font-bold">{accessKey.id}</DialogDescription>
          <DialogDescription>This action cannot be undone. Please confirm your decision to proceed.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleRevoke} disabled={isPending}>
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
