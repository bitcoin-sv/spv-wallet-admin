import { Contact } from '@bsv/spv-wallet-js-client';

export const isContact = (obj: unknown): obj is Contact => {
  return typeof obj === 'object' && obj !== null && typeof (obj as Contact).fullName !== 'undefined';
};
