import { SpvWalletClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface ContactsQueryOptions {
  page?: number;
  page_size?: number;
  order_by_field?: string;
  sort_direction?: string;
  spvWalletClient: SpvWalletClientExtended;
  createdRange?: {
    from: string;
    to: string;
  };
  id?: string;
  paymail?: string;
  pubKey?: string;
  updatedRange?: { from: string; to: string };
}

export const contactsQueryOptions = (opts: ContactsQueryOptions) => {
  const { createdRange, updatedRange, order_by_field, sort_direction, id, paymail, pubKey } = opts;

  return queryOptions({
    queryKey: ['contacts', createdRange, updatedRange, order_by_field, sort_direction, id, paymail, pubKey],
    queryFn: async () =>
      await opts.spvWalletClient.AdminGetContacts(
        { createdRange, updatedRange, id, paymail, pubKey, includeDeleted: true },
        {},
        { order_by_field: order_by_field ?? 'id', sort_direction: sort_direction ?? 'asc' },
      ),
  });
};
