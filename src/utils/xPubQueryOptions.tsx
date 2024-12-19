import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface XPubQueryOptions {
  id?: string;
  currentBalance?: number;
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  spvWalletClient: SpvWalletClientExtended;
}

export const xPubQueryOptions = (opts: XPubQueryOptions) => {
  const { id, currentBalance = undefined, page, page_size, order_by_field, sort_direction, spvWalletClient } = opts;

  return queryOptions({
    queryKey: ['xpubs', id, currentBalance, page, page_size, order_by_field, sort_direction],
    queryFn: async () =>
      await spvWalletClient.AdminGetXPubs(
        { id, currentBalance, includeDeleted: true },
        {},
        {
          page,
          page_size,
          order_by_field: order_by_field ?? 'id',
          sort_direction: sort_direction ?? 'desc',
        },
      ),
  });
};
