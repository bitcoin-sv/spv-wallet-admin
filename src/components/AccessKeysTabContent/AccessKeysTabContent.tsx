import {
  accessKeysColumns,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  NoRecordsText,
  RevokeKeyDialog,
  ViewDialog,
} from '@/components';
import { AccessKeyExtended } from '@/interfaces';

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
            renderItem={(row) => (
              <>
                <ViewDialog row={row} />
                {hasRevokeKeyDialog && <RevokeKeyDialog row={row} />}
              </>
            )}
          />
        ) : (
          <NoRecordsText message="No Access Keys to show." />
        )}
      </CardContent>
    </Card>
  );
};
