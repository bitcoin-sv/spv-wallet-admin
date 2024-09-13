import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  RowType,
} from '@/components';
import { Row } from '@tanstack/react-table';
import React from 'react';

export interface ViewDialogProps {
  row: Row<RowType>;
}

export const ViewDialog = ({ row }: ViewDialogProps) => {
  const renderInfo = (obj: RowType) =>
    Object.entries(obj as NonNullable<unknown>).map((item) => {
      const [field, value] = item;
      if (field === 'status') {
        return;
      }

      if (field === 'metadata' || field === 'outputs') {
        return (
          <div key={field}>
            <span className="text-gray-400">{field}:</span> {JSON.stringify(value) as React.ReactNode}
          </div>
        );
      }
      return (
        <div key={field} className="break-all">
          <span className="text-gray-400">{field}:</span>{' '}
          {typeof value === 'boolean' ? value.toString() : (value as React.ReactNode)}
        </div>
      );
    });
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-5/6 overflow-auto">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>Show full information</DialogDescription>
        </DialogHeader>
        {renderInfo(row.original)}
      </DialogContent>
    </Dialog>
  );
};
