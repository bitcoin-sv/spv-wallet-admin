import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { AddXpubDialog } from '@/components/AddXpubDialog/AddXpubDialog.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { DataTable } from '@/components/XPubTable/DataTable.tsx';
import { columns } from '@/components/XPubTable/columns.tsx';
import { XpubExtended } from '@/interfaces';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSpvWalletClient } from '@/contexts';

export const Route = createFileRoute('/_admin/xpub')({
  component: Xpub,
});

export function Xpub() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState<string>('all');

  const { data } = useSuspenseQuery({
    queryKey: ['xpubs'],
    queryFn: async () => await spvWalletClient!.AdminGetXPubs({}, {}, {}),
  });

  const mappedData: XpubExtended[] = data.map((xpub) => {
    return {
      ...xpub,
      status: xpub.deleted_at === null ? 'active' : 'deleted',
    };
  });

  const deletedXpubs = mappedData.filter((xpub) => xpub.status === 'deleted');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <AddXpubDialog />
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>XPubs</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {data.length > 0 ? (
                <DataTable columns={columns} data={mappedData} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">You have no xPubs</h3>
                  <p className="text-sm text-muted-foreground">You can add xPub right now.</p>
                  <AddXpubDialog />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deleted">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>XPubs</CardTitle>
            </CardHeader>
            <CardContent>
              {deletedXpubs.length > 0 ? (
                <DataTable columns={columns} data={deletedXpubs} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No xPubs to show.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </Suspense>
  );
}
