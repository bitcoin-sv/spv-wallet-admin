import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

export interface OldAccessKeysQueryOptions {
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

export interface AccessKeysQueryOptions {
  page?: number;
  pageSize?: number;
  orderByField?: string;
  sortDirection?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  revokedRange?: { from: string; to: string };
  updatedRange?: { from: string; to: string };
}

export const accessKeysQueryOptions = (opts: AccessKeysQueryOptions) => {
  const { page, pageSize, orderByField, sortDirection, createdRange, updatedRange, revokedRange } = opts;
  return queryOptions({
    queryKey: ['accessKeys', opts],
    queryFn: async () =>
      await opts.spvWalletClient.GetAccessKeys(
        { createdRange, updatedRange, revokedRange },
        {
          page,
          size: pageSize,
          sortBy: orderByField ?? 'id',
          sort: sortDirection ?? 'desc',
        },
      ),
  });
};
