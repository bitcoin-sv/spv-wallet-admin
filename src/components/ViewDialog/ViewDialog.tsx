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
import { useTheme } from '@/contexts';
import { Row } from '@tanstack/react-table';
import React from 'react';
import ReactJson from 'react-json-view';

export interface ViewDialogProps {
  row: Row<RowType>;
}

export const ViewDialog = ({ row }: ViewDialogProps) => {
  const { theme } = useTheme();

  const isDarkTheme = theme === 'dark';

  const renderInfo = (obj: RowType) =>
    Object.entries(obj as NonNullable<unknown>).map((item) => {
      const [field, value] = item;
      if (field === 'status') {
        return;
      }

      if ((field === 'metadata' || field === 'outputs') && value !== null) {
        return (
          <div key={field} className="flex justify-between">
            <span className="text-gray-400">{field}:</span>
            <span>
              <ReactJson
                src={value as Record<string, unknown>}
                theme={isDarkTheme ? 'monokai' : 'rjv-default'}
                name={false}
                collapsed={true}
              />
            </span>
          </div>
        );
      }
      return (
        <div key={field} className="flex flex-1 justify-between">
          <span className="text-gray-400 mr-2">{field}:</span>
          <div className="overflow-x-scroll max-w-xl whitespace-nowrap">
            {typeof value === 'boolean' ? value.toString() : (value as React.ReactNode)}
          </div>
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
