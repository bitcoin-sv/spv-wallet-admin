import { queryOptions } from '@tanstack/react-query';
import { getUserApi } from '../store/clientStore';

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

export const transactionsUserQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort, createdRange, blockHeight, sortBy, page, size, updatedRange } = opts;
  const userApi = getUserApi();

  return queryOptions({
    queryKey: ['transactions', sort, createdRange, blockHeight, sortBy, page, size, updatedRange],
    queryFn: async () =>
      await userApi.transactions({ blockHeight, createdRange, updatedRange }, {}, { page, size, sortBy, sort }),
  });
};
