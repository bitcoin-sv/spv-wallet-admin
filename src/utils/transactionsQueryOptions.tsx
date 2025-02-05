import { SpvWalletAdminClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

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
  spvWalletClient: SpvWalletAdminClientExtended;
}

export const transactionsQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort, createdRange, blockHeight, sortBy, page, size, spvWalletClient, updatedRange } = opts;

  return queryOptions({
    queryKey: ['transactions', sort, createdRange, blockHeight, sortBy, size, page, spvWalletClient, updatedRange],
    queryFn: async () =>
      await spvWalletClient.transactions(
        { blockHeight, createdRange, updatedRange, includeDeleted: true },
        {},
        { page, size, sortBy, sort },
      ),
  });
};
