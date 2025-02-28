import { Tx } from '@bsv/spv-wallet-js-client';
import { TransactionStatusValue } from '@/constants';

declare module '@bsv/spv-wallet-js-client' {
  interface Tx {
    status?: TransactionStatusValue;
  }
}

export interface TransactionExtended extends Tx {
  status: TransactionStatusValue;
}
