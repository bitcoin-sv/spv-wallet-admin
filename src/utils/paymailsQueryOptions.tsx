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
}

export const paymailsQueryOptions = (opts: PaymailsQueryOptions) => {
  const { page, size, sortBy, sort, createdRange, updatedRange, spvWalletClient } = opts;

  return queryOptions({
    queryKey: ['paymails', page, size, sortBy, sort, createdRange, updatedRange],
    queryFn: async () => {
      const userInfo = await spvWalletClient.GetUserInfo();
      const xpubId = userInfo?.id;

      if (!xpubId) {
        throw new Error('User xpubId is required for fetching paymails');
      }

      return await spvWalletClient.GetPaymails(
        { id: xpubId, createdRange, updatedRange },
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
