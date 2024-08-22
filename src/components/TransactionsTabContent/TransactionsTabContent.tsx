import { Card, CardContent, CardHeader, CardTitle, DataTable, TransactionEditDialog } from '@/components';
import { columns } from '@/components/TransactionsColumns/columns.tsx';
import { Tx } from '@bsv/spv-wallet-js-client';
import React from 'react';

export interface TransactionsTabContentProps {
  transactions: Tx[];
  hasRecordTransaction?: boolean;
  hasTransactionEditDialog?: boolean;
  TxDialog: React.ComponentType;
}

export const TransactionsTabContent = ({
  transactions,
  hasRecordTransaction,
  hasTransactionEditDialog,
  TxDialog,
}: TransactionsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {transactions.length > 0 ? (
          <DataTable
            columns={columns}
            data={transactions}
            renderItem={(row) => hasTransactionEditDialog && <TransactionEditDialog row={row} />}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no Transactions</h3>
            {hasRecordTransaction && (
              <>
                <p className="text-sm text-muted-foreground mb-2">You can record Transaction here.</p>
                <TxDialog />
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
