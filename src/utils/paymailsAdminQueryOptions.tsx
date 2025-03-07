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
  includeDeleted?: boolean;
}

export const paymailsAdminQueryOptions = (opts: PaymailsAdminQueryOptions) => {
  const { xpubId, page, size, sortBy, sort, createdRange, updatedRange, alias, includeDeleted = true } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['paymails', xpubId, page, size, sortBy, sort, createdRange, updatedRange, alias, includeDeleted],
    queryFn: async () =>
      await adminApi.paymails(
        { alias, xpubId, createdRange, updatedRange, includeDeleted },
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
