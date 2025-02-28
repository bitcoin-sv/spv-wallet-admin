export const TRANSACTION_STATUS = {
  ALL: null,
  CREATED: 'CREATED',
  BROADCASTED: 'BROADCASTED',
  MINED: 'MINED',
  REVERTED: 'REVERTED',
  PROBLEMATIC: 'PROBLEMATIC',
} as const;

export type TransactionStatusType = typeof TRANSACTION_STATUS;
export type TransactionStatusValue = TransactionStatusType[keyof TransactionStatusType];
