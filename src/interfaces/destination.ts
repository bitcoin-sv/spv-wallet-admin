import { Destination } from '@bsv/spv-wallet-js-client';

export interface DestinationExtended extends Destination {
  status: string;
}
