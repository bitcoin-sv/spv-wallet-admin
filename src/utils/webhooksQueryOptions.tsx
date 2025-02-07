import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export interface WebhooksQueryOptions {}

export const webhooksQueryOptions = (opts: WebhooksQueryOptions = {}) => {
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['webhooks', opts],
    queryFn: async () => adminApi.webhooks(),
  });
};
