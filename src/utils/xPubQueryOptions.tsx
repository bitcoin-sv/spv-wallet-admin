import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface XPubQueryOptions {
  id?: string;
  currentBalance?: number;
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  spvWalletClient: SpvWalletClientExtended;
}

export const xPubQueryOptions = (opts: XPubQueryOptions) => {
  const { id, currentBalance = undefined, page, size, sort, sortBy, spvWalletClient } = opts;

  return queryOptions({
    queryKey: ['xpubs', id, currentBalance, page, size, sort, sortBy],
    queryFn: async () =>
      await spvWalletClient.AdminGetXPubs(
        { id, currentBalance, includeDeleted: true },
        {},
        {
          page,
          size,
          sortBy: sortBy ?? 'id',
          sort: sort ?? 'desc',
        },
      ),
  });
};
