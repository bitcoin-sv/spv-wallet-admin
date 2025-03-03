import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';
import { TransactionExtended } from '@/interfaces/transaction';
import { TRANSACTION_STATUS } from '../constants/transactions';

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
  status?: string | null;
}

export const transactionsQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort, createdRange, blockHeight, sortBy, page, size, updatedRange, status } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['transactions', sort, createdRange, blockHeight, sortBy, page, size, updatedRange, status],
    queryFn: async () => {
      const response = await adminApi.transactions(
        { blockHeight, createdRange, updatedRange, status: status || undefined },
        {},
        { page, size, sortBy, sort },
      );
      return {
        ...response,
        content: response.content.map((tx) => ({
          ...tx,
          status: tx.status || TRANSACTION_STATUS.CREATED,
        })) as TransactionExtended[],
      };
    },
  });
};
