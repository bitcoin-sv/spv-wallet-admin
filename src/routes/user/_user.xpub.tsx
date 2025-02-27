import { Card, CardContent, CardHeader, CardTitle, CustomErrorComponent, Toaster, DateCell } from '@/components';
import { Metadata } from '@bsv/spv-wallet-js-client';
import { ReactNode, createFileRoute, useLoaderData } from '@tanstack/react-router';
import { getUserApi } from '@/store/clientStore';
import ReactJson from 'react-json-view';
import { useTheme } from '@/contexts';

export const Route = createFileRoute('/user/_user/xpub')({
  component: XPub,
  errorComponent: ({ error }) => <CustomErrorComponent error={error} />,
  loader: async () => {
    const userApi = getUserApi();
    return await userApi.xPub();
  },
});

function XPub() {
  const xPub = useLoaderData({ from: '/user/_user/xpub' });
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const renderMetadata = (metadata: Metadata | undefined) => {
    if (!metadata) {
      return null;
    }

    return (
      <ReactJson
        src={metadata}
        theme={isDarkTheme ? 'monokai' : 'rjv-default'}
        name={false}
        collapsed={true}
        enableClipboard={false}
      />
    );
  };

  const renderXpub = () => {
    if (!xPub) {
      return null;
    }

    return Object.entries(xPub).map(([key, value]) => {
      // Skip rendering if value is null or undefined
      if (value === null || value === undefined) {
        return null;
      }

      return (
        <div key={key} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
          <span className="text-sm font-medium">{key}:</span>
          <div className="text-sm break-all">
            {key === 'metadata' ? (
              <div className="overflow-x-auto">{renderMetadata(value as Metadata | undefined)}</div>
            ) : key === 'createdAt' || key === 'updatedAt' ? (
              <DateCell date={value as string} />
            ) : (
              <span>{value as ReactNode}</span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="grid w-full gap-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>XPub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="mt-4 space-y-1">{renderXpub()}</div>
        </CardContent>
      </Card>
      <Toaster position="bottom-center" />
    </div>
  );
}
