import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export interface XPubQueryOptions {
  id?: string;
  currentBalance?: number;
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
}

export const xPubQueryOptions = (opts: XPubQueryOptions) => {
  const { id, currentBalance = undefined, page, size, sort, sortBy } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['xpubs', id, currentBalance, page, size, sort, sortBy],
    queryFn: async () =>
      await adminApi.xPubs(
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
