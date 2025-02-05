import { User as BaseUser } from '@bsv/spv-wallet-js-client';

export interface ExtendedUser extends BaseUser {
  paymails?: string[];
}
