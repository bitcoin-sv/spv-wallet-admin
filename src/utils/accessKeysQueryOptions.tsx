import { queryOptions } from '@tanstack/react-query';
import { SpvWalletUserClientExtended } from '@/contexts';

export interface AccessKeysQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  spvWalletClient: SpvWalletUserClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  revokedRange?: { from: string; to: string };
  updatedRange?: { from: string; to: string };
}

export const accessKeysQueryOptions = (opts: AccessKeysQueryOptions) => {
  const { page, size, sortBy, sort, createdRange, updatedRange, revokedRange } = opts;

  return queryOptions({
    queryKey: ['accessKeys', page, size, sortBy, sort, createdRange, updatedRange, revokedRange],
    queryFn: async () =>
      await opts.spvWalletClient.accessKeys(
        { createdRange, updatedRange, revokedRange },
        {
          page,
          size,
          sortBy: sortBy ?? 'id',
          sort: sort ?? 'desc',
        },
      ),
  });
};
