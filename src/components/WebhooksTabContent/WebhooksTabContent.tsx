import { Card, CardContent, CardHeader, CardTitle, DataTable, MobileDataTable, webhookColumns } from '@/components';
import { UnsubscribeWebhook } from '@/components/UnsubscribeWebhook/UnsubscribeWebhook.tsx';
import { WebhooksMobileList, webhookMobileColumns } from '@/components/WebhooksColumns/WebhooksColumnsMobile';
import { WebhooksColumnsMobile } from '@/components/WebhooksColumns/WebhooksColumnsMobile';
import { ColumnSort } from '@tanstack/react-table';

export interface WebhooksTabContentProps {
  webhooks: WebhooksColumnsMobile[];
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
          <>
            <div className="hidden sm:block">
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
            </div>
            <div className="sm:hidden">
              <MobileDataTable
                columns={webhookMobileColumns}
                data={webhooks}
                initialSorting={initalSorting}
                renderMobileItem={(item: WebhooksColumnsMobile, { expandedItems, setExpandedItems }) => (
                  <WebhooksMobileList webhooks={[item]} value={expandedItems} onValueChange={setExpandedItems} />
                )}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no webhooks</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
