import { SpvWalletClientExtended } from '@/contexts';
import { prepareXPubFilters } from '@/utils/prepareXPubFilters.ts';
import { queryOptions } from '@tanstack/react-query';

export interface XPubQueryOptions {
  filterStr?: string;
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  spvWalletClient: SpvWalletClientExtended;
}

export const xPubQueryOptions = (opts: XPubQueryOptions) => {
  const { filterStr, page, page_size, order_by_field, sort_direction, spvWalletClient } = opts;
  const { id, currentBalance = undefined } = prepareXPubFilters(filterStr ?? '');

  return queryOptions({
    queryKey: ['xpubs', id, currentBalance, page, page_size, order_by_field, sort_direction],
    queryFn: async () =>
      await spvWalletClient.AdminGetXPubs(
        { id, currentBalance: currentBalance ?? undefined, includeDeleted: true },
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
