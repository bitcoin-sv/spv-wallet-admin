import { userBalanceQueryOptions } from '@/utils/userBalanceQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Badge } from '../ui';
import { WalletIcon } from 'lucide-react';

export const UserBalance = () => {
  const { data: balance } = useSuspenseQuery(userBalanceQueryOptions());

  return (
    <>
      <Badge variant="outline" className="p-2 pl-3 pr-3 flex justify-center items-center gap-2">
        <WalletIcon size="16px" />
        {balance ? balance.toLocaleString() : 0} SATS
      </Badge>
    </>
  );
};
