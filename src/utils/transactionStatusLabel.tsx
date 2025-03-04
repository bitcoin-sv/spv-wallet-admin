import { TransactionStatusType } from '@/constants/transactions';

export function formatStatusLabel(key: keyof TransactionStatusType) {
  if (key === 'ALL') {
    return 'All';
  }
  return capitalizeFirstLetter(key.toString());
}

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
