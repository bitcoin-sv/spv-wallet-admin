import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

import { CircleX, Search } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';

import { AddPaymailDialog } from '@/components/AddPaymailDialog';
import { DataTable } from '@/components/DataTable';
import { DateRangeFilter } from '@/components/DateRangeFIlter/DateRangeFilter.tsx';
import { columns } from '@/components/PaymailsColumns/columns.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useSpvWalletClient } from '@/contexts';
import { addStatusField, errorWrapper, getDeletedElements } from '@/utils';
import { paymailsQueryOptions } from '@/utils/paymailsQueryOptions.tsx';

export const Route = createFileRoute('/(admin)/_admin/paymails')({
  component: Paymails,
  validateSearch: z.object({
    order_by_field: z.string().optional().catch('id'),
    sort_direction: z.string().optional().catch('desc'),
    xpubId: z.string().optional().catch(''),
    createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
    updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  }),
  loaderDeps: ({ search }) => ({
    order_by_field: search?.order_by_field,
    sort_direction: search?.sort_direction,
    xpubId: search?.xpubId,
    createdRange: search?.createdRange,
    updatedRange: search?.updatedRange,
  }),
  loader: async ({ context: { queryClient, spvWallet }, deps }) => {
    const { sort_direction, order_by_field, xpubId, createdRange, updatedRange } = deps;
    return await queryClient.ensureQueryData(
      paymailsQueryOptions({
        spvWalletClient: spvWallet.spvWalletClient!,
        xpubId,
        sort_direction,
        order_by_field,
        createdRange,
        updatedRange,
      }),
    );
  },
});

export function Paymails() {
  const [tab, setTab] = useState<string>('all');
  const [filter, setFilter] = useState<string>('');

  const { spvWalletClient } = useSpvWalletClient();
  const { order_by_field, sort_direction, xpubId, createdRange, updatedRange } = useSearch({
    from: '/_admin/paymails',
  });

  const [debouncedFilter] = useDebounce(filter, 200);
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const { data: paymails } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    paymailsQueryOptions({
      spvWalletClient: spvWalletClient!,
      xpubId,
      order_by_field,
      sort_direction,
      createdRange,
      updatedRange,
    }),
  );

  const mappedPaymails = addStatusField(paymails);
  const deletedPaymails = getDeletedElements(mappedPaymails);

  useEffect(() => {
    if (tab !== 'all') {
      navigate({
        search: () => {
          return {};
        },
        replace: false,
      });
    }
  }, [tab]);

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          xpubId: filter || undefined,
        };
      },
      replace: true,
    });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter(xpubId || '');
    navigate({
      search: (old) => {
        return {
          ...old,
          xpubId,
        };
      },
      replace: true,
    });
  }, [xpubId]);

  const onDelete = async (alias: string, domain: string) => {
    try {
      const address = `${alias}@${domain}`;
      await spvWalletClient?.AdminDeletePaymail(address);
      await queryClient.invalidateQueries();
      toast.success('Paymail successfully deleted');
    } catch (error) {
      toast.error('Unable to delete Paymail');
      errorWrapper(error);
    }
  };

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <div className="flex">
            <AddPaymailDialog className="mr-3" />
            <div className="relative flex-1 md:grow-0 mr-3">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              {filter.length > 0 && (
                <CircleX
                  onClick={() => setFilter('')}
                  className="h-4 w-4 right-2.5 top-3 text-muted-foreground absolute cursor-pointer"
                />
              )}

              <Input
                type="search"
                placeholder="Search by xpub id..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
            <DateRangeFilter />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Paymails</CardTitle>
            </CardHeader>
            <CardContent className="mb-2">
              {mappedPaymails.length > 0 ? (
                <DataTable columns={columns} data={mappedPaymails} isDelete onDelete={onDelete} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No Paymails to show.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deleted">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Paymails</CardTitle>
            </CardHeader>
            <CardContent>
              {deletedPaymails.length > 0 ? (
                <DataTable columns={columns} data={deletedPaymails} />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm text-muted-foreground">No Paymails to show.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
