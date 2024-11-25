import { Card, CardContent, CardHeader, CardTitle, DataTable, webhookColumns } from '@/components';
import { UnsubscribeWebhook } from '@/components/UnsubscribeWebhook/UnsubscribeWebhook.tsx';
import { WebhookExtended } from '@/interfaces/webhook.ts';
import { ColumnSort } from '@tanstack/react-table';

export interface WebhooksTabContentProps {
  webhooks: WebhookExtended[];
}

const initalSorting: ColumnSort[] = [{ id: 'url', desc: false }];

export const WebhooksTabContent = ({ webhooks }: WebhooksTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {webhooks.length > 0 ? (
          <DataTable
            columns={webhookColumns}
            data={webhooks}
            initialSorting={initalSorting}
            renderInlineItem={(row) => (
              <>
                <UnsubscribeWebhook row={row} />
              </>
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no webhooks</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
