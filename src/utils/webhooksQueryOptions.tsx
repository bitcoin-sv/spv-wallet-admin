import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface WebhooksQueryOptions {
  spvWalletClient: SpvWalletClientExtended;
}

export const webhooksQueryOptions = (opts: WebhooksQueryOptions) => {
  const { spvWalletClient } = opts;

  return queryOptions({
    queryKey: ['webhooks', opts],
    queryFn: () => spvWalletClient.AdminGetWebhooks(),
  });
};
