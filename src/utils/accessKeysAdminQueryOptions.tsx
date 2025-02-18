import { AccessKeysQueryOptions } from '@/utils/accessKeysQueryOptions.tsx';
import { queryOptions } from '@tanstack/react-query';

export interface AccessKeysAdminQueryOptions extends AccessKeysQueryOptions {
  xpubId?: string;
}

export const accessKeysAdminQueryOptions = (opts: AccessKeysAdminQueryOptions) => {
  const { page, size, sort, sortBy, createdRange, updatedRange, revokedRange, xpubId } = opts;

  return queryOptions({
    queryKey: ['accessKeysAdmin', page, size, sortBy, sort, createdRange, updatedRange, revokedRange, xpubId],
    queryFn: async () =>
      await opts.spvWalletClient.AdminGetAccessKeys(
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
