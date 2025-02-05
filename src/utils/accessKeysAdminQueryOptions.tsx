import { queryOptions } from '@tanstack/react-query';
import { SpvWalletAdminClientExtended } from '@/contexts';

export interface AccessKeysAdminQueryOptions {
  xpubId?: string;
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  spvWalletClient: SpvWalletAdminClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  revokedRange?: { from: string; to: string };
  updatedRange?: { from: string; to: string };
}

export const accessKeysAdminQueryOptions = (opts: AccessKeysAdminQueryOptions) => {
  const { page, size, sort, sortBy, createdRange, updatedRange, revokedRange, xpubId } = opts;

  return queryOptions({
    queryKey: ['accessKeysAdmin', page, size, sortBy, sort, createdRange, updatedRange, revokedRange, xpubId],
    queryFn: async () =>
      await opts.spvWalletClient.accessKeys(
        { xpubId, createdRange, updatedRange, revokedRange, includeDeleted: true },
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
