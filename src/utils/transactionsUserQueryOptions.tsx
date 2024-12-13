import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

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

export const transactionsUserQueryOptions = (opts: TransactionsQueryOptions) => {
  const { sort_direction, createdRange, blockHeight, order_by_field, page, page_size, spvWalletClient, updatedRange } =
    opts;

  return queryOptions({
    queryKey: [
      'transactions',
      sort_direction,
      createdRange,
      blockHeight,
      order_by_field,
      page,
      page_size,
      updatedRange,
    ],
    queryFn: async () =>
      await spvWalletClient.GetTransactions(
        { blockHeight, createdRange, updatedRange },
        {},
        { page, pageSize: page_size, orderByField: order_by_field, sortDirection: sort_direction },
      ),
  });
};
