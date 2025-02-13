import { queryOptions } from '@tanstack/react-query';
import { getUserApi } from '../store/clientStore';

export interface PaymailsQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  id?: string;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
  alias?: string;
}

export const paymailsQueryOptions = (opts: PaymailsQueryOptions) => {
  const { id, page, size, sortBy, sort, createdRange, updatedRange, alias } = opts;
  const userApi = getUserApi();

  return queryOptions({
    queryKey: ['paymails', id, page, size, sortBy, sort, createdRange, updatedRange, alias],
    queryFn: async () =>
      await userApi.paymails(
        { alias, id, createdRange, updatedRange, includeDeleted: true },
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
