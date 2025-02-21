import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export interface PaymailsAdminQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  xpubId?: string;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
  alias?: string;
}

export const paymailsAdminQueryOptions = (opts: PaymailsAdminQueryOptions) => {
  const { xpubId, page, size, sortBy, sort, createdRange, updatedRange, alias } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['paymails', xpubId, page, size, sortBy, sort, createdRange, updatedRange, alias],
    queryFn: async () =>
      await adminApi.paymails(
        { alias, xpubId, createdRange, updatedRange, includeDeleted: true },
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
