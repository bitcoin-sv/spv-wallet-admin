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
  // TODO [explicit-any]: consider add type if it's possible
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  row: Row<any>;
}

export const ViewDialog = ({ row }: ViewDialogProps) => {
  // TODO [explicit-any]: consider add type if it's possible
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const renderInfo = (obj: any) =>
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
          <span className="text-gray-400">{field}:</span> {value as React.ReactNode}
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
