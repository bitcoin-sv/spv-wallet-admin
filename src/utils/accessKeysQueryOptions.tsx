import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

export interface AccessKeysQueryOptions {
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  revokedRange?: { from: string; to: string };
  updatedRange?: { from: string; to: string };
}

export const accessKeysQueryOptions = (opts: AccessKeysQueryOptions) => {
  const { page, page_size, order_by_field, sort_direction, createdRange, updatedRange, revokedRange } = opts;
  return queryOptions({
    queryKey: ['accessKeys', opts],
    queryFn: async () =>
      await opts.spvWalletClient.GetAccessKeys(
        { createdRange, updatedRange, revokedRange },
        {},
        {
          page,
          pageSize: page_size,
          orderByField: order_by_field ?? 'id',
          sortDirection: sort_direction ?? 'desc',
        },
      ),
  });
};
