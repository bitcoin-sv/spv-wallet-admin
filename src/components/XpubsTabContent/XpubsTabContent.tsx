import {
  AddXpubDialog,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  MobileDataTable,
  ViewDialog,
  xPubsColumns,
} from '@/components';
import { XPubMobileItem } from '@/components/XPubColumns/XPubColumnsMobile';
import { XpubExtended } from '@/interfaces';

export interface XpubsTabContentProps {
  xpubs: XpubExtended[];
}

export const XpubsTabContent = ({ xpubs }: XpubsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>XPubs</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {xpubs.length > 0 ? (
          <>
            <div className="hidden sm:block">
              <DataTable columns={xPubsColumns} data={xpubs} renderItem={(row) => <ViewDialog row={row} />} />
            </div>
            <div className="sm:hidden">
              <MobileDataTable
                columns={xPubsColumns}
                data={xpubs}
                renderMobileItem={(item: XpubExtended) => <XPubMobileItem xpub={item} />}
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
