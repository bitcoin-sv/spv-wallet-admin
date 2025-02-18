import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface UserBalanceQueryOptions {
  spvWalletClient: SpvWalletClientExtended;
}

export const userBalanceQueryOptions = (opts: UserBalanceQueryOptions) => {
  return queryOptions({
    queryKey: ['balance', opts],
    queryFn: async () => {
      const user = await opts.spvWalletClient.GetUserInfo();
      return user.currentBalance;
    },
  });
};
