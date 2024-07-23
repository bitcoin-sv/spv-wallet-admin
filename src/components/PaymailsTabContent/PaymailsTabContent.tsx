import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ContactDeleteDialogProps,
  DataTable,
  NoRecordsText,
  paymailColumns,
} from '@/components';
import { PaymailExtended } from '@/interfaces/paymail.ts';

export interface PaymailsTabContentProps {
  paymails: PaymailExtended[];
  DeleteDialog?: React.ComponentType<ContactDeleteDialogProps>;
}

export const PaymailsTabContent = ({ paymails, DeleteDialog }: PaymailsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paymails</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {paymails.length > 0 ? (
          <DataTable columns={paymailColumns} data={paymails} DeleteDialog={DeleteDialog} />
        ) : (
          <NoRecordsText message="No Paymails to show." />
        )}
      </CardContent>
    </Card>
  );
};
