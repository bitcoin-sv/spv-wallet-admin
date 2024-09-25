import {
  CustomErrorComponent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  WebhooksTabContent,
} from '@/components';
import { useSpvWalletClient } from '@/contexts';

import { addStatusField, webhooksQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/admin/_admin/webhooks')({
  component: Webhooks,
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
});

export function Webhooks() {
  const { spvWalletClient } = useSpvWalletClient();
  const [tab, setTab] = useState('all');

  const { data: webhooks } = useSuspenseQuery(
    // At this point, spvWalletClient is defined; using non-null assertion.
    webhooksQueryOptions({
      spvWalletClient: spvWalletClient!,
    }),
  );

  const mappedWebhooks = addStatusField(webhooks);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">
          <WebhooksTabContent webhooks={mappedWebhooks} />
        </TabsContent>
      </Tabs>
      <Toaster position="bottom-center" />
    </>
  );
}
