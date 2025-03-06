import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '@/store/clientStore';

export type ContactStatus = 'unconfirmed' | 'awaiting' | 'confirmed' | 'rejected';

export interface ContactsQueryOptions {
  page?: number;
  size?: number;
  sort?: string;
  sortBy?: string;
  createdRange?: {
    from: string;
    to: string;
  };
  id?: string;
  paymail?: string;
  pubKey?: string;
  updatedRange?: { from: string; to: string };
  status?: ContactStatus;
  includeDeleted?: boolean;
}

export const contactsQueryOptions = (opts: ContactsQueryOptions) => {
  const {
    createdRange,
    updatedRange,
    page,
    size,
    sortBy,
    sort,
    id,
    paymail,
    pubKey,
    status,
    includeDeleted = true,
  } = opts;
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: [
      'contacts',
      createdRange,
      updatedRange,
      sortBy,
      sort,
      id,
      paymail,
      pubKey,
      status,
      includeDeleted,
      page,
      size,
    ],
    queryFn: async () =>
      await adminApi.contacts(
        { createdRange, updatedRange, id, paymail, pubKey, status, includeDeleted },
        {},
        { sortBy: sortBy ?? 'id', sort: sort ?? 'asc', page, size },
      ),
  });
};
