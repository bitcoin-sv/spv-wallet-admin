import {
    CustomErrorComponent,
    PaymailsTabContent,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Toaster,
  } from '@/components';
  import { useSpvWalletClient } from '@/contexts';
  import { paymailsQueryOptions, addStatusField } from '@/utils';
  import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
  import { createFileRoute } from '@tanstack/react-router';
  import { useState } from 'react';
  
  export const Route = createFileRoute('/user/_user/paymails')({
    component: Paymails,
    errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
    loader: async ({ context: { queryClient, spvWallet } }) => {
      const userInfo = await spvWallet.spvWalletClient!.GetUserInfo();
  
      if (!userInfo?.id) {
        throw new Error("User xpubId is required for fetching paymails");
      }
  
      return await queryClient.ensureQueryData(
        paymailsQueryOptions({
          spvWalletClient: spvWallet.spvWalletClient!,
        }),
      );
    },
  });
  
  export function Paymails() {
    const [tab, setTab] = useState<string>('all');
    const { spvWalletClient } = useSpvWalletClient();
  
    const { data: userInfo, error: userError } = useQuery({
      queryKey: ['userInfo'],
      queryFn: async () => await spvWalletClient?.GetUserInfo(),
    });
  
    const { data: paymails, error: paymailsError } = useSuspenseQuery(
      paymailsQueryOptions({
        spvWalletClient: spvWalletClient!,
      }),
    );
  
    if (userError) {
      return <CustomErrorComponent error={userError} />;
    }
  
    if (!userInfo?.id) {
      return <CustomErrorComponent error={new Error("User xpubId is required for fetching paymails")} />;
    }
  
    if (paymailsError) {
      return <CustomErrorComponent error={paymailsError} />;
    }
  
    const mappedPaymails = addStatusField(paymails.content);
  
    return (
      <>
        <Tabs defaultValue={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <PaymailsTabContent paymails={mappedPaymails} />
          </TabsContent>
        </Tabs>
        <Toaster position="bottom-center" />
      </>
    );
  }
  