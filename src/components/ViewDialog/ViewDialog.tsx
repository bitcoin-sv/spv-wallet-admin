import { Row } from '@tanstack/react-table';
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from '@/components';

export interface ViewDialogProps {
  row: Row<any>;
}

export const ViewDialog = ({ row }: ViewDialogProps) => {
  const renderInfo = (obj: any) =>
    Object.entries(obj as NonNullable<unknown>).map((item) => {
      const [field, value] = item;
      if (field === 'status') {
        return;
      }

      if (field === 'metadata') {
        return <div key={field}>metadata: {JSON.stringify(value) as React.ReactNode}</div>;
      }

      return (
        <div key={field} className="break-all">
          {field}: {value as React.ReactNode}
        </div>
      );
    });
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-5/6 overflow-auto">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>Show full information</DialogDescription>
        </DialogHeader>
        {renderInfo(row.original)}
      </DialogContent>
    </Dialog>
  );
};
