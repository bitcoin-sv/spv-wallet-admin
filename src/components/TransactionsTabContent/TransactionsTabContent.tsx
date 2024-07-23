import { Tx } from '@bsv/spv-wallet-js-client';

import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ContactEditDialogProps,
  DataTable,
  TransactionEditDialogProps,
} from '@/components';
import { columns } from '@/components/TransactionsColumns/columns.tsx';

export interface TransactionsTabContentProps {
  transactions: Tx[];
  TxDialog: React.ComponentType;
  EditDialog?: React.ComponentType<ContactEditDialogProps | TransactionEditDialogProps>;
}

export const TransactionsTabContent = ({ transactions, TxDialog, EditDialog }: TransactionsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {transactions.length > 0 ? (
          <DataTable columns={columns} data={transactions} EditDialog={EditDialog} />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no Transactions</h3>
            <p className="text-sm text-muted-foreground mb-2">You can record Transaction here.</p>
            <TxDialog />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
