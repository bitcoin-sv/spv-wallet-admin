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
import { AccessKeysMobileList } from '@/components/AccessKeysColumns/AccessKeysColumnsMobile';
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
          <>
            <div className="hidden sm:block">
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
            </div>
            <div className="sm:hidden">
              <AccessKeysMobileList accessKeys={accessKeys} />
            </div>
          </>
        ) : (
          <NoRecordsText message="No Access Keys to show." />
        )}
      </CardContent>
    </Card>
  );
};
