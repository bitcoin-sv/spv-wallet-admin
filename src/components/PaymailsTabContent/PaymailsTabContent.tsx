import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  NoRecordsText,
  paymailColumns,
  PaymailDeleteDialog,
} from '@/components';
import { PaymailExtended } from '@/interfaces/paymail.ts';

export interface PaymailsTabContentProps {
  paymails: PaymailExtended[];
  hasPaymailDeleteDialog?: boolean;
}

export const PaymailsTabContent = ({ paymails, hasPaymailDeleteDialog }: PaymailsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paymails</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {paymails.length > 0 ? (
          <DataTable
            columns={paymailColumns}
            data={paymails}
            renderItem={(row) =>
              hasPaymailDeleteDialog && row.original.status !== 'deleted' && <PaymailDeleteDialog row={row} />
            }
          />
        ) : (
          <NoRecordsText message="No Paymails to show." />
        )}
      </CardContent>
    </Card>
  );
};
