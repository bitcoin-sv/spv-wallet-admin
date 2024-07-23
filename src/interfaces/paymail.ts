import { PaymailAddress } from '@bsv/spv-wallet-js-client';

export interface PaymailExtended extends PaymailAddress {
  status: string;
}
