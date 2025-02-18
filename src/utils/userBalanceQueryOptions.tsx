import { queryOptions } from '@tanstack/react-query';
import { getUserApi } from '../store/clientStore';

export const userBalanceQueryOptions = () => {
  const userApi = getUserApi();

  return queryOptions({
    queryKey: ['balance'],
    queryFn: async () => {
      const user = await userApi.xPub();
      return user.currentBalance;
    },
  });
};
