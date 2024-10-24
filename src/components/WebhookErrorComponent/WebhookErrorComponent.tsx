import { ErrorResponse } from '@bsv/spv-wallet-js-client';
import { ErrorComponentProps } from '@tanstack/react-router';
import { CustomErrorComponent } from '@/components';
import { Ban } from 'lucide-react';

const WebhooksDisabled = () => (
  <div className="flex flex-col w-full h-[80vh] justify-center items-center">
    <p>
      <Ban className="size-44 text-gray-500" />
    </p>
    <p className="mt-4 text-gray-500">Notification feature is not enabled</p>
  </div>
);

export const WebhookErrorComponent = ({ error }: ErrorComponentProps) => {
  if (error instanceof ErrorResponse) {
    const content = JSON.parse(error.content);
    if (content.code === 'error-notifications-disabled') {
      return <WebhooksDisabled />;
    }
  }

  return <CustomErrorComponent error={error} />;
};
