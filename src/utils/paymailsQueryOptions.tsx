import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export interface PaymailsQueryOptions {
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
}

export const paymailsQueryOptions = (opts: PaymailsQueryOptions) => {
  const { xpubId, page, size, sortBy, sort, createdRange, updatedRange } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['paymails', xpubId, page, size, sortBy, sort, createdRange, updatedRange],
    queryFn: async () =>
      await adminApi.paymails(
        { xpubId, createdRange, updatedRange, includeDeleted: true },
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
