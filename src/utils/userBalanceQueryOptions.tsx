import { SpvWalletUserClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface UserBalanceQueryOptions {
  spvWalletClient: SpvWalletUserClientExtended;
}

export const userBalanceQueryOptions = (opts: UserBalanceQueryOptions) => {
  return queryOptions({
    queryKey: ['balance', opts],
    queryFn: async () => {
      const user = await opts.spvWalletClient.xPub();
      return user.currentBalance;
    },
  });
};
