import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  TransactionEditDialog as BaseTransactionEditDialog,
  ViewDialog as BaseViewDialog,
} from '@/components';
import { columns } from '@/components/TransactionsColumns/TransactionColumns';
import { TransactionsMobileList } from '@/components/TransactionsColumns/TransactionColumnsMobile';
import { Tx } from '@bsv/spv-wallet-js-client';
import React from 'react';
import { PaginationProps } from '@/components/DataTable/DataTable';
import { Row } from '@tanstack/react-table';
import { RowType } from '../DataTable/DataTable';
import { TransactionExtended } from '@/interfaces/transaction';

// Create wrapper components that handle the type conversion
const ViewDialog = ({ row }: { row: Row<TransactionExtended> }) => {
  return <BaseViewDialog row={row as unknown as Row<RowType>} />;
};

const TransactionEditDialog = ({ row }: { row: Row<TransactionExtended> }) => {
  return <BaseTransactionEditDialog row={row as unknown as Row<Tx>} />;
};

export interface TransactionsTabContentProps {
  transactions: TransactionExtended[];
  hasRecordTransaction?: boolean;
  hasTransactionEditDialog?: boolean;
  TxDialog: React.ComponentType;
  pagination?: PaginationProps;
}

export const TransactionsTabContent = ({
  transactions,
  hasRecordTransaction,
  hasTransactionEditDialog,
  TxDialog,
  pagination,
}: TransactionsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {transactions.length > 0 ? (
          <>
            <div className="hidden sm:block">
              <DataTable
                columns={columns}
                data={transactions}
                renderItem={(row) => (
                  <>
                    <ViewDialog row={row} />
                    {hasTransactionEditDialog && <TransactionEditDialog row={row} />}
                  </>
                )}
                pagination={pagination}
              />
            </div>
            <div className="sm:hidden">
              <TransactionsMobileList transactions={transactions} pagination={pagination} />
            </div>
          </>
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
