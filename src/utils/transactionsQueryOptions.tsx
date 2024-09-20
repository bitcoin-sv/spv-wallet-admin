import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface TransactionsQueryOptions {
  blockHeight?: number;
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
  spvWalletClient: SpvWalletClientExtended;
}

export const transactionsQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort_direction, createdRange, blockHeight, order_by_field, page, page_size, spvWalletClient, updatedRange } =
    opts;

  return queryOptions({
    queryKey: ['transactions', opts],
    queryFn: async () =>
      await spvWalletClient.AdminGetTransactions(
        { blockHeight, createdRange, updatedRange, includeDeleted: true },
        {},
        { page, page_size, order_by_field, sort_direction },
      ),
  });
};
