import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  NoRecordsText,
  paymailColumns,
  PaymailDeleteDialog,
  ViewDialog,
} from '@/components';
import { PaymailExtended } from '@/interfaces/paymail.ts';
import { useIsAdmin } from '@/store/clientStore';

export interface PaymailsTabContentProps {
  paymails: PaymailExtended[];
  hasPaymailDeleteDialog?: boolean;
}

export const PaymailsTabContent = ({ paymails, hasPaymailDeleteDialog }: PaymailsTabContentProps) => {
  const isAdminUser = useIsAdmin();
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
            renderItem={(row) => {
              return (
                <>
                  <ViewDialog row={row} />
                  {isAdminUser && hasPaymailDeleteDialog && row.original.deletedAt == null && (
                    <PaymailDeleteDialog row={row} />
                  )}
                </>
              );
            }}
          />
        ) : (
          <NoRecordsText message="No Paymails to show." />
        )}
      </CardContent>
    </Card>
  );
};
