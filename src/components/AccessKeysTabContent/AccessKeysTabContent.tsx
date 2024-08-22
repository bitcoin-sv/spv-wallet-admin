import {
  accessKeysColumns,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  NoRecordsText,
  RevokeKeyDialog,
} from '@/components';
import { AccessKeyExtended } from '@/interfaces';
import { AccessKey } from '@bsv/spv-wallet-js-client';
import { Row } from '@tanstack/react-table';

export interface AccessKeysTabContentProps {
  accessKeys: AccessKeyExtended[];
  hasRevokeKeyDialog?: boolean;
}

export const AccessKeysTabContent = ({ accessKeys, hasRevokeKeyDialog }: AccessKeysTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Keys</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {accessKeys.length > 0 ? (
          <DataTable
            columns={accessKeysColumns}
            data={accessKeys}
            renderItem={(row) => hasRevokeKeyDialog && <RevokeKeyDialog row={row as Row<AccessKey>} />}
          />
        ) : (
          <NoRecordsText message="No Access Keys to show." />
        )}
      </CardContent>
    </Card>
  );
};
