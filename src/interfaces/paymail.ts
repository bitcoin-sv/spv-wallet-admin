import { OldPaymailAddress } from '@bsv/spv-wallet-js-client';

export interface PaymailExtended extends OldPaymailAddress {
  status: string;
}
