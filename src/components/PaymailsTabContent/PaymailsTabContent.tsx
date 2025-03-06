import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  MobileDataTable,
  NoRecordsText,
  paymailColumns,
  PaymailDeleteDialog as BasePaymailDeleteDialog,
  ViewDialog as BaseViewDialog,
} from '@/components';
import { PaymailMobileItem } from '@/components/PaymailsColumns/PaymailColumnsMobile';
import { PaymailExtended } from '@/interfaces/paymail.ts';
import { useIsAdmin } from '@/store/clientStore';
import { PaginationProps } from '@/components/DataTable/DataTable';
import { Row } from '@tanstack/react-table';
import { RowType } from '../DataTable/DataTable';
import { PaymailAddress } from '@bsv/spv-wallet-js-client';

// Create wrapper components that handle the type conversion
const ViewDialog = ({ row }: { row: Row<PaymailExtended> }) => {
  return <BaseViewDialog row={row as unknown as Row<RowType>} />;
};

const PaymailDeleteDialog = ({ row }: { row: Row<PaymailExtended> }) => {
  return <BasePaymailDeleteDialog row={row as unknown as Row<PaymailAddress>} />;
};

export interface PaymailsTabContentProps {
  paymails: PaymailExtended[];
  hasPaymailDeleteDialog?: boolean;
  pagination?: PaginationProps;
}

export const PaymailsTabContent = ({ paymails, hasPaymailDeleteDialog, pagination }: PaymailsTabContentProps) => {
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
                pagination={pagination}
                manualPagination={!!pagination}
              />
            </div>
            <div className="sm:hidden">
              <MobileDataTable
                columns={paymailColumns}
                data={paymails}
                renderMobileItem={(item: PaymailExtended, expandedState) => (
                  <PaymailMobileItem paymail={item} expandedState={expandedState} />
                )}
                pagination={pagination}
                manualPagination={!!pagination}
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
