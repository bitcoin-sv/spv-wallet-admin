import { AddXpubDialog, Card, CardContent, CardHeader, CardTitle, DataTable, xPubsColumns } from '@/components';
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
          <DataTable columns={xPubsColumns} data={xpubs} />
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
