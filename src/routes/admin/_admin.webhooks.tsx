import { Tabs, TabsContent, TabsList, TabsTrigger, Toaster, WebhooksTabContent } from '@/components';
import { addStatusField, webhooksQueryOptions } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { WebhookErrorComponent } from '@/components/WebhookErrorComponent';

export const Route = createFileRoute('/admin/_admin/webhooks')({
  component: Webhooks,
  errorComponent: WebhookErrorComponent,
  loader: async ({ context: { queryClient } }) => await queryClient.ensureQueryData(webhooksQueryOptions()),
});

export function Webhooks() {
  const [tab, setTab] = useState('all');

  const { data: webhooks } = useSuspenseQuery(webhooksQueryOptions());

  const mappedWebhooks = addStatusField(webhooks);

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="max-w-screen overflow-x-scroll scrollbar-hide">
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
