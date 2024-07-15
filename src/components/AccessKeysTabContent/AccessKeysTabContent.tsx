import React from 'react';

import {
  accessKeysColumns,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  NoRecordsText,
  RevokeKeyDialogProps,
} from '@/components';
import { AccessKeyExtended } from '@/interfaces';

export interface AccessKeysTabContentProps {
  accessKeys: AccessKeyExtended[];
  RevokeKeyDialog?: React.ComponentType<RevokeKeyDialogProps>;
}
export const AccessKeysTabContent = ({ accessKeys, RevokeKeyDialog }: AccessKeysTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Keys</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {accessKeys.length > 0 ? (
          <DataTable columns={accessKeysColumns} data={accessKeys} RevokeKeyDialog={RevokeKeyDialog} />
        ) : (
          <NoRecordsText message="No Access Keys to show." />
        )}
      </CardContent>
    </Card>
  );
};
