import { Badge } from '@/components/ui/badge';
import { TRANSACTION_STATUS, TransactionStatusValue } from '@/constants';

/**
 * Renders a badge component with appropriate styling based on the transaction status
 * @param status The transaction status value
 * @returns A Badge component with appropriate styling
 */
export function renderTransactionStatusBadge(status: TransactionStatusValue) {
  switch (status) {
    case TRANSACTION_STATUS.MINED:
      return <Badge variant="secondary">Mined</Badge>;
    case TRANSACTION_STATUS.CREATED:
      return <Badge variant="outline">Created</Badge>;
    case TRANSACTION_STATUS.BROADCASTED:
      return <Badge>Broadcasted</Badge>;
    case TRANSACTION_STATUS.REVERTED:
      return <Badge variant="destructive">Reverted</Badge>;
    case TRANSACTION_STATUS.PROBLEMATIC:
      return <Badge variant="destructive">Problematic</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
