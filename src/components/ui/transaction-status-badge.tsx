import React from 'react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TransactionStatusBadgeProps {
  status: string;
}

const getBadgeColor = (status: string): string => {
  switch (status) {
    case 'CREATED':
      return 'text-gray-700 bg-gray-200';
    case 'BROADCASTED':
      return 'text-white bg-blue-500';
    case 'MINED':
      return 'text-white bg-green-600';
    case 'REVERTED':
      return 'text-white bg-red-600';
    case 'PROBLEMATIC':
      return 'text-black bg-yellow-500';
    default:
      return 'text-gray-700 bg-gray-300';
  }
};

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  return <Badge className={cn(getBadgeColor(status))}>{status}</Badge>;
};

export default TransactionStatusBadge;
