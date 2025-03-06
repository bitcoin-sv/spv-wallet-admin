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
import { PaginationProps } from '@/components/DataTable/DataTable';

export interface AccessKeysTabContentProps {
  accessKeys: AccessKeyExtended[];
  hasRevokeKeyDialog?: boolean;
  pagination?: PaginationProps;
}

export const AccessKeysTabContent = ({ accessKeys, hasRevokeKeyDialog, pagination }: AccessKeysTabContentProps) => {
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
                pagination={pagination}
                manualPagination={!!pagination}
              />
            </div>
            <div className="sm:hidden">
              <AccessKeysMobileList accessKeys={accessKeys} pagination={pagination} />
            </div>
          </>
        ) : (
          <NoRecordsText message="No Access Keys to show." />
        )}
      </CardContent>
    </Card>
  );
};
