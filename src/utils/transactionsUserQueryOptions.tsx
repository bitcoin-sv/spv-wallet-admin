import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

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
  spvWalletClient: SpvWalletClientExtended;
}

export const transactionsUserQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort, createdRange, blockHeight, sortBy, page, size, spvWalletClient, updatedRange } = opts;

  return queryOptions({
    queryKey: ['transactions', sort, createdRange, blockHeight, sortBy, page, size, updatedRange],
    queryFn: async () =>
      await spvWalletClient.GetTransactions(
        { blockHeight, createdRange, updatedRange },
        {},
        { page, size, sortBy, sort },
      ),
  });
};
