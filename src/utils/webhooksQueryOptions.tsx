import { queryOptions } from '@tanstack/react-query';
import { getAdminApi } from '../store/clientStore';

export const webhooksQueryOptions = () => {
  const adminApi = getAdminApi();

  return queryOptions({
    queryKey: ['webhooks'],
    queryFn: async () => adminApi.webhooks(),
  });
};
