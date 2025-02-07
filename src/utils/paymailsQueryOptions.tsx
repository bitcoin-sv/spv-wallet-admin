import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

export interface PaymailsQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: { from: string; to: string };
  updatedRange?: { from: string; to: string };
  alias?: string;
}

export const paymailsQueryOptions = (opts: PaymailsQueryOptions) => {
  const { page, size, sortBy, sort, createdRange, updatedRange, spvWalletClient, alias } = opts;

  return queryOptions({
    queryKey: ['paymails', page, size, sortBy, sort, createdRange, updatedRange, alias],
    queryFn: async () => {
      return await spvWalletClient.GetPaymails(
        { aliast: alias, createdRange, updatedRange }, // aliast is a typo, should be alias
        {},
        {
          page,
          size,
          sortBy: sortBy ?? 'id',
          sort: sort ?? 'desc',
        },
      );
    },
  });
};
