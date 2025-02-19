import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export interface XPubQueryOptions {
  id?: string;
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
}

export const xPubQueryOptions = (opts: XPubQueryOptions) => {
  const { id, page, size, sort, sortBy } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['xpubs', id, page, size, sort, sortBy],
    queryFn: async () =>
      await adminApi.xPubs(
        { id, includeDeleted: true },
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
