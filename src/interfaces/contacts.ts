import { Contact } from '@bsv/spv-wallet-js-client';

export interface ContactExtended extends Contact {
  status: string;
}
