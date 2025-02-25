import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DateCell,
} from '@/components';
import { useTheme } from '@/contexts';
import { RowType } from '@/components/DataTable';
import React from 'react';
import ReactJson from 'react-json-view';

export interface ViewDialogMobileProps {
  data: RowType;
}

export const ViewDialogMobile = ({ data }: ViewDialogMobileProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const dateFields = ['createdAt', 'updatedAt', 'deletedAt'];

  const renderInfo = (obj: RowType) =>
    Object.entries(obj as NonNullable<unknown>).map((item) => {
      const [field, value] = item;
      if (field === 'status') {
        return null;
      }

      if (dateFields.includes(field)) {
        return (
          <div key={field} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
            <span className="text-sm font-medium">{field}:</span>
            <DateCell date={value as string}/>
          </div>
        );
      }

      if ((field === 'metadata' || field === 'outputs') && value !== null) {
        return (
          <div key={field} className="grid grid-cols-1 gap-2 py-2 border-b last:border-0">
            <span className="text-sm font-medium">{field}:</span>
            <div className="overflow-x-auto">
              <ReactJson
                src={value as Record<string, unknown>}
                theme={isDarkTheme ? 'monokai' : 'rjv-default'}
                name={false}
                collapsed={true}
                enableClipboard={false}
                style={{ fontSize: '12px' }}
              />
            </div>
          </div>
        );
      }

      if (field === 'hex' || field === 'xpub_in_ids') {
        return (
          <div key={field} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
            <span className="text-sm font-medium">{field}:</span>
            <div className="text-sm break-all">
              {typeof value === 'boolean' ? value.toString() : (value as React.ReactNode)}
            </div>
          </div>
        );
      }

      return (
        <div key={field} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
          <span className="text-sm font-medium">{field}:</span>
          <div className="text-sm break-all">
            {typeof value === 'boolean' ? value.toString() : (value as React.ReactNode)}
          </div>
        </div>
      );
    });

  return (
    <Dialog>
      <DialogTrigger className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
        View
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-32px)] h-[calc(100%-64px)] overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>Show full information</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-1">{renderInfo(data)}</div>
      </DialogContent>
    </Dialog>
  );
};
