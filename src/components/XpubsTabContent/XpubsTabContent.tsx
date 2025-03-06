import {
  AddXpubDialog,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  MobileDataTable,
  ViewDialog as BaseViewDialog,
  xPubsColumns,
} from '@/components';
import { XPubMobileItem } from '@/components/XPubColumns/XPubColumnsMobile';
import { XpubExtended } from '@/interfaces';
import { PaginationProps } from '@/components/DataTable/DataTable';
import { Row } from '@tanstack/react-table';
import { RowType } from '../DataTable/DataTable';

// Create wrapper component that handles the type conversion
const ViewDialog = ({ row }: { row: Row<XpubExtended> }) => {
  return <BaseViewDialog row={row as unknown as Row<RowType>} />;
};

export interface XpubsTabContentProps {
  xpubs: XpubExtended[];
  pagination?: PaginationProps;
}

export const XpubsTabContent = ({ xpubs, pagination }: XpubsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>XPubs</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {xpubs.length > 0 ? (
          <>
            <div className="hidden sm:block">
              <DataTable
                columns={xPubsColumns}
                data={xpubs}
                renderItem={(row) => <ViewDialog row={row} />}
                pagination={pagination}
                manualPagination={!!pagination}
              />
            </div>
            <div className="sm:hidden">
              <MobileDataTable
                columns={xPubsColumns}
                data={xpubs}
                renderMobileItem={(item: XpubExtended, expandedState) => (
                  <XPubMobileItem xpub={item} expandedState={expandedState} />
                )}
                pagination={pagination}
                manualPagination={!!pagination}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no xPubs</h3>
            <p className="text-sm text-muted-foreground">You can add xPub here.</p>
            <AddXpubDialog />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
