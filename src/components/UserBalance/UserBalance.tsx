import { useSpvWalletClient } from '@/contexts';
import { userBalanceQueryOptions } from '@/utils/userBalanceQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Badge } from '../ui';
import { WalletIcon } from 'lucide-react';

export const UserBalance = () => {
  const { spvWalletClient } = useSpvWalletClient();

  const { data: balance } = useSuspenseQuery(
    userBalanceQueryOptions({
      spvWalletClient: spvWalletClient!,
    }),
  );

  return (
    <>
      {balance ? (
        <Badge variant="outline" className="p-2 pl-3 pr-3 flex justify-center items-center gap-2">
          <WalletIcon size="16px" />
          {balance.toLocaleString()} SATS
        </Badge>
      ) : null}
    </>
  );
};
