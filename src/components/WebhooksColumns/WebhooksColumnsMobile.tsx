import { Webhook } from '@bsv/spv-wallet-js-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import { UnsubscribeWebhook } from '@/components/UnsubscribeWebhook/UnsubscribeWebhook';
import { ColumnDef } from '@tanstack/react-table';

export interface WebhooksColumnsMobile extends Webhook {
  status: string;
  id?: string;
}

const onClickCopy = (value: string, label: string) => async () => {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  toast.success(`${label} Copied to clipboard`);
};

export interface WebhooksMobileListProps {
  webhooks: WebhooksColumnsMobile[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export const WebhooksMobileList = ({ webhooks, value, onValueChange }: WebhooksMobileListProps) => {
  const truncateUrl = (url: string) => {
    if (url.length <= 30) {
      return url;
    }
    return `${url.slice(0, 20)}...${url.slice(-10)}`;
  };

  const getWebhookId = (webhook: WebhooksColumnsMobile) => {
    if (webhook.id) {
      return webhook.id;
    }
    return `webhook-${webhook.url}`;
  };

  return (
    <Accordion type="multiple" value={value} onValueChange={onValueChange}>
      {webhooks.map((webhook) => {
        const webhookId = getWebhookId(webhook);
        return (
          <AccordionItem key={webhookId} value={webhookId} className="px-2">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 space-y-1 text-left">
                  <p className="text-sm font-medium leading-none">{truncateUrl(webhook.url)}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {webhook.status === 'banned' ? (
                      <Badge variant="secondary">Banned</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-4 py-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">URL:</span>
                  <span className="cursor-pointer truncate" onClick={onClickCopy(webhook.url, 'URL')}>
                    {webhook.url}
                  </span>
                </div>

                <div className="flex justify-end">
                  <UnsubscribeWebhook webhook={webhook} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export { type ColumnDef };
