import { createFileRoute, useLoaderData } from '@tanstack/react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components';

export const Route = createFileRoute('/user/_user/xpub')({
  component: XPub,
  loader: async ({ context: { spvWallet } }) => await spvWallet.spvWalletClient!.GetXPub(),
});

function XPub() {
  const xPub = useLoaderData({ from: '/user/_user/xpub' });

  const renderXpub = () => {
    if (!xPub) {
      return null;
    }

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
