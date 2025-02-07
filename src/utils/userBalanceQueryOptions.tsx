import { queryOptions } from '@tanstack/react-query';
import { getUserApi } from '../store/clientStore';

export interface UserBalanceQueryOptions {}

export const userBalanceQueryOptions = (opts: UserBalanceQueryOptions = {}) => {
  const userApi = getUserApi();

  return queryOptions({
    queryKey: ['balance', opts],
    queryFn: async () => {
      const user = await userApi.xPub();
      return user.currentBalance;
    },
  });
};
