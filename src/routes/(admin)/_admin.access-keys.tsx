import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Search, ListFilter } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { AddXpubDialog } from '@/components/AddXpubDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { DataTable } from '@/components/XPubTable';
import { columns } from '@/components/XPubTable/columns.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';

export const Route = createFileRoute('/(admin)/_admin/access-keys')({
  component: AccessKeys,
  loader: async ({ context }) => await context.spvWallet.spvWalletClient!.AdminGetAccessKeys({}, {}, {}),
});

export function AccessKeys() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="revoked">Revoked</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <div className="relative flex-1 md:grow-0 mr-6">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Filter by xpub id..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
            <Button variant="outline">
              <ListFilter className="w-5 h-5" />
              <span className="ml-2">Filter</span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Access Keys</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {/*{data.length > 0 ? (*/}
              {/*  <DataTable columns={columns} data={mappedData} />*/}
              {/*) : (*/}
              {/*  <div className="flex flex-col items-center gap-1 text-center">*/}
              {/*    <h3 className="text-2xl font-bold tracking-tight">You have no xPubs</h3>*/}
              {/*    <p className="text-sm text-muted-foreground">You can add xPub here.</p>*/}
              {/*    <AddXpubDialog />*/}
              {/*  </div>*/}
              {/*)}*/}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deleted">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Access Keys</CardTitle>
            </CardHeader>
            <CardContent>
              {/*{deletedXpubs.length > 0 ? (*/}
              {/*  <DataTable columns={columns} data={deletedXpubs} />*/}
              {/*) : (*/}
              {/*  <div className="flex flex-col items-center gap-1 text-center">*/}
              {/*    <p className="text-sm text-muted-foreground">No xPubs to show.</p>*/}
              {/*  </div>*/}
              {/*)}*/}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
