import { createFileRoute, ErrorComponent, useLoaderData } from '@tanstack/react-router';

import { Card, CardContent, CardHeader, CardTitle, CustomErrorComponent } from '@/components';
import { ErrorResponse } from '@bsv/spv-wallet-js-client';

export const Route = createFileRoute('/user/_user/xpub')({
  component: XPub,
  errorComponent: ({ error }) => {
    if (error instanceof ErrorResponse) {
      return <CustomErrorComponent error={error} />;
    }
    return <ErrorComponent error={error} />;
  },
  loader: async ({ context: { spvWallet } }) => await spvWallet.spvWalletClient!.GetXPub(),
});

function XPub() {
  const xPub = useLoaderData({ from: '/user/_user/xpub' });

  const renderXpub = () => {
    if (!xPub) return null;
    return Object.entries(xPub).map(([key, value]) => (
      <div key={key} className="flex justify-between">
        <span className="text-gray-400">{key}:</span> <span>{value}</span>
      </div>
    ));
  };
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>XPub</CardTitle>
      </CardHeader>
      <CardContent>{renderXpub()}</CardContent>
    </Card>
  );
}
