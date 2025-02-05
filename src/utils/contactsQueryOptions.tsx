import { SpvWalletAdminClientExtended } from '@/contexts';
import { queryOptions } from '@tanstack/react-query';

export interface ContactsQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  spvWalletClient: SpvWalletAdminClientExtended;
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
  const { createdRange, updatedRange, page, size, sortBy, sort, id, paymail, pubKey } = opts;

  return queryOptions({
    queryKey: ['contacts', createdRange, updatedRange, sortBy, sort, id, paymail, pubKey, page, size],
    queryFn: async () =>
      await opts.spvWalletClient.contacts(
        { createdRange, updatedRange, id, paymail, pubKey, includeDeleted: true },
        {},
        { sortBy: sortBy ?? 'id', sort: sort ?? 'asc', page, size },
      ),
  });
};
