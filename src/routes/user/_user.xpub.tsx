import { Card, CardContent, CardHeader, CardTitle, CustomErrorComponent } from '@/components';
import { ReactNode, createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/user/_user/xpub')({
  component: XPub,
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async ({ context: { spvWallet } }) => await spvWallet.spvWalletClient!.GetUserInfo(),
});

function XPub() {
  const xPub = useLoaderData({ from: '/user/_user/xpub' });

  const renderXpub = () => {
    if (!xPub) {
      return null;
    }

    return Object.entries(xPub).map(([key, value]) => (
      <div key={key} className="flex justify-between">
        <span className="text-gray-400">{key}:</span> <span>{value as ReactNode}</span>
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
