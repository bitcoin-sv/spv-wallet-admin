import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface DestinationsQueryOptions {
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  updatedRange?: { from: string; to: string };
  lockingScript?: string;
  address?: string;
}

export const destinationsQueryOptions = (opts: DestinationsQueryOptions) => {
  const { page, page_size, order_by_field, sort_direction, createdRange, updatedRange, lockingScript, address } = opts;

  return queryOptions({
    queryKey: ['destinations', opts],
    queryFn: async () =>
      await opts.spvWalletClient.GetDestinations(
        { lockingScript, address, createdRange, updatedRange, includeDeleted: true },
        {},
        { page, page_size, order_by_field: order_by_field ?? 'id', sort_direction: sort_direction ?? 'desc' },
      ),
  });
};
