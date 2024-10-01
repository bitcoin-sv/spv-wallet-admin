import { Webhook } from '@bsv/spv-wallet-js-client';

export interface WebhookExtended extends Webhook {
  status: string;
}
