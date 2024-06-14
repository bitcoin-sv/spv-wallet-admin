import { queryOptions } from '@tanstack/react-query';
import { prepareXPubFilters } from '@/utils/prepareXPubFilters.ts';
import { SpvWalletClientExtended } from '@/contexts';

export const xPubQueryOptions = (opts: {
  filterStr?: string;
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  spvWalletClient: SpvWalletClientExtended;
}) => {
  const { filterStr, page, page_size, order_by_field, sort_direction, spvWalletClient } = opts;
  const { id, currentBalance = undefined } = prepareXPubFilters(filterStr ?? '');

  return queryOptions({
    queryKey: ['xpubs', opts],
    queryFn: async () =>
      await spvWalletClient.AdminGetXPubs(
        { id, currentBalance: currentBalance ?? undefined },
        {},
        {
          page,
          page_size,
          order_by_field,
          sort_direction,
        },
      ),
  });
};
