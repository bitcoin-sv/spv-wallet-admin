import { AccessKeysQueryOptions } from '@/utils/accessKeysQueryOptions.tsx';
import { queryOptions } from '@tanstack/react-query';

export interface AccessKeysAdminQueryOptions extends AccessKeysQueryOptions {
  xpubId?: string;
}

export const accessKeysAdminQueryOptions = (opts: AccessKeysAdminQueryOptions) => {
  const { page, page_size, order_by_field, sort_direction, createdRange, updatedRange, revokedRange, xpubId } = opts;
  return queryOptions({
    queryKey: ['accessKeysAdmin', opts],
    queryFn: async () =>
      await opts.spvWalletClient.AdminGetAccessKeys(
        { xpubId, createdRange, updatedRange, revokedRange, includeDeleted: true },
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
