import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '@/store/clientStore';

export interface AccessKeysAdminQueryOptions {
  xpubId?: string;
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  createdRange?: {
    from: string;
    to: string;
  };
  revokedRange?: { from: string; to: string };
  updatedRange?: { from: string; to: string };
}

export const accessKeysAdminQueryOptions = (opts: AccessKeysAdminQueryOptions) => {
  const { page, size, sort, sortBy, createdRange, updatedRange, revokedRange, xpubId } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['accessKeysAdmin', page, size, sortBy, sort, createdRange, updatedRange, revokedRange, xpubId],
    queryFn: async () =>
      await adminApi.accessKeys(
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
