import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export interface TransactionsQueryOptions {
  blockHeight?: number;
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
}

export const transactionsQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort, createdRange, blockHeight, sortBy, page, size, updatedRange } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['transactions', sort, createdRange, blockHeight, sortBy, size, page, updatedRange],
    queryFn: async () =>
      await adminApi.transactions(
        { blockHeight, createdRange, updatedRange, includeDeleted: true },
        {},
        { page, size, sortBy, sort },
      ),
  });
};
