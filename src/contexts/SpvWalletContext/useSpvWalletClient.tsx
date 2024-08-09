import { useContext } from 'react';
import { SpvWalletContext } from '@/contexts';

export const useSpvWalletClient = () => {
  const spvWalletClient = useContext(SpvWalletContext);

  if (!spvWalletClient) {
    throw new Error('useSpvWalletClient must be used within a SpvWalletProvider');
  }
  return spvWalletClient;
};
