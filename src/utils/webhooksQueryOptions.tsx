import { SpvWalletAdminClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface WebhooksQueryOptions {
  spvWalletClient: SpvWalletAdminClientExtended;
}

export const webhooksQueryOptions = (opts: WebhooksQueryOptions) => {
  const { spvWalletClient } = opts;

  return queryOptions({
    queryKey: ['webhooks', opts],
    queryFn: async () => spvWalletClient.webhooks(),
  });
};
