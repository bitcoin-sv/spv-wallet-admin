import { Card, CardContent, CardHeader, CardTitle, CustomErrorComponent, Toaster } from '@/components';
import { Metadata } from '@bsv/spv-wallet-js-client';
import { ReactNode, createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/user/_user/xpub')({
  component: XPub,
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { spvWallet } }) => await spvWallet.spvWalletClient!.GetUserInfo(),
});

function XPub() {
  const xPub = useLoaderData({ from: '/user/_user/xpub' });

  const renderMetadata = (metadata: Metadata | undefined) => {
    if (!metadata) {
      return null;
    }

    return JSON.stringify(metadata);
  };

  const renderXpub = () => {
    if (!xPub) {
      return null;
    }

    return Object.entries(xPub).map(([key, value]) => {
      return (
        <div key={key} className="flex justify-between gap-2">
          <span className="text-gray-400">{key}:</span>
          {key === 'metadata' ? (
            <span className="break-words whitespace-pre-wrap overflow-hidden text-right">
              {renderMetadata(value as Metadata | undefined)}
            </span>
          ) : (
            <span>{value as ReactNode}</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="grid w-full gap-4">
      <div className="flex justify-end">
        <div className="flex gap-2" />
      </div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>XPub</CardTitle>
        </CardHeader>
        <CardContent>{renderXpub()}</CardContent>
      </Card>
      <Toaster position="bottom-center" />
    </div>
  );
}
