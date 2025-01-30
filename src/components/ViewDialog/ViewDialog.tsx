import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  RowType,
  DateCell,
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
      if (field === "createdAt" || field === "updatedAt") {
        return (
          <div key={field} className="flex flex-1 justify-between">
            <span className="text-gray-400 mr-2">{field}:</span>
            <DateCell date={value as string} />
          </div>
        );
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
                enableClipboard={false}
              />
            </span>
          </div>
        );
      }
      if (field === 'hex' || field === 'xpub_in_ids') {
        return (
          <div key={field} className="flex flex-1 justify-between">
            <span className="text-gray-400 mr-2">{field}:</span>
            <div className="max-w-xl break-words">
              {typeof value === 'boolean' ? value.toString() : (value as React.ReactNode)}
            </div>
          </div>
        );
      }
      return (
        <div key={field} className="flex flex-1 justify-between">
          <span className="text-gray-400 mr-2">{field}:</span>
          <div className="overflow-x-auto max-w-2xl whitespace-nowrap">
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
      <DialogContent className="max-w-3xl max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>Show full information</DialogDescription>
        </DialogHeader>
        {renderInfo(row.original)}
      </DialogContent>
    </Dialog>
  );
};
