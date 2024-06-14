import { AccessKey } from '@bsv/spv-wallet-js-client';

export interface AccessKeyExtended extends AccessKey {
  status: string;
}
