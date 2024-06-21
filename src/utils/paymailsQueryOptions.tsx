import { queryOptions } from '@tanstack/react-query';
import { SpvWalletClientExtended } from '@/contexts';

export interface PaymailsQueryOptions {
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  xpubId?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
}

export const paymailsQueryOptions = (opts: PaymailsQueryOptions) => {
  const { xpubId, page, page_size, order_by_field, sort_direction, createdRange, updatedRange } = opts;
  return queryOptions({
    queryKey: ['paymails', opts],
    queryFn: async () =>
      await opts.spvWalletClient.AdminGetPaymails(
        { xpubId, createdRange, updatedRange },
        {},
        {
          page,
          page_size,
          order_by_field: order_by_field ?? 'id',
          sort_direction: sort_direction ?? 'desc',
        },
      ),
  });
};
