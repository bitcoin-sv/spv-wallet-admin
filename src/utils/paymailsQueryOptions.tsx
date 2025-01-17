import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

export interface PaymailsQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  xpubId?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
}

export const paymailsQueryOptions = (opts: PaymailsQueryOptions) => {
  const { xpubId, page, size, sortBy, sort, createdRange, updatedRange } = opts;

  return queryOptions({
    queryKey: ['paymails', xpubId, page, size, sortBy, sort, createdRange, updatedRange],
    queryFn: async () =>
      await opts.spvWalletClient.AdminGetPaymails(
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
