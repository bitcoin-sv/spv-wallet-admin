import { XPub } from '@bsv/spv-wallet-js-client';

export interface XpubExtended extends XPub {
  status: string;
}
