import { Tx } from '@bsv/spv-wallet-js-client';

export interface TransactionExtended extends Tx {
  status: string;
}
