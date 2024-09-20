import { DestinationsQueryOptions } from '@/utils/destinationsQueryOptions.tsx';
import { queryOptions } from '@tanstack/react-query';

export const destinationsAdminQueryOptions = (opts: DestinationsQueryOptions) => {
  const { order_by_field, sort_direction, createdRange, updatedRange, lockingScript, address, spvWalletClient } = opts;

  return queryOptions({
    queryKey: ['destinationsAdmin', opts],
    queryFn: async () =>
      await spvWalletClient!.AdminGetDestinations(
        { includeDeleted: true, lockingScript, address, createdRange, updatedRange },
        {},
        { order_by_field, sort_direction },
      ),
  });
};
