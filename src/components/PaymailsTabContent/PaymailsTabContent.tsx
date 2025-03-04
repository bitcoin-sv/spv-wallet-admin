import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  MobileDataTable,
  NoRecordsText,
  paymailColumns,
  PaymailDeleteDialog,
  ViewDialog,
} from '@/components';
import { PaymailMobileItem } from '@/components/PaymailsColumns/PaymailColumnsMobile';
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
          <>
            <div className="hidden sm:block">
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
            </div>
            <div className="sm:hidden">
              <MobileDataTable
                columns={paymailColumns}
                data={paymails}
                renderMobileItem={(item: PaymailExtended) => <PaymailMobileItem paymail={item} />}
              />
            </div>
          </>
        ) : (
          <NoRecordsText message="No Paymails to show." />
        )}
      </CardContent>
    </Card>
  );
};
