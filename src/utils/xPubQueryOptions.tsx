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
  const { id = undefined, page, size, sort, sortBy, spvWalletClient } = opts;
  return queryOptions({
    queryKey: ['xpubs', id, page, size, sort, sortBy],
    queryFn: async () =>
      await spvWalletClient.AdminGetXPubs(
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
