import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  NoRecordsText,
  paymailColumns,
  PaymailDeleteDialogProps,
} from '@/components';
import { PaymailExtended } from '@/interfaces/paymail.ts';

export interface PaymailsTabContentProps {
  paymails: PaymailExtended[];
  PaymailDeleteDialog?: React.ComponentType<PaymailDeleteDialogProps>;
}

export const PaymailsTabContent = ({ paymails, PaymailDeleteDialog }: PaymailsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paymails</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {paymails.length > 0 ? (
          <DataTable columns={paymailColumns} data={paymails} PaymailDeleteDialog={PaymailDeleteDialog} />
        ) : (
          <NoRecordsText message="No Paymails to show." />
        )}
      </CardContent>
    </Card>
  );
};
