import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DestinationEditDialogProps,
  destinationsColumns,
  NoRecordsText,
} from '@/components';
import { DestinationExtended } from '@/interfaces/destination.ts';

export interface DestinationsTabContentProps {
  destinations: DestinationExtended[];
  EditDialog?: React.ComponentType<DestinationEditDialogProps>;
}
export const DestinationsTabContent = ({ destinations, EditDialog }: DestinationsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Destinations</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {destinations.length > 0 ? (
          <DataTable columns={destinationsColumns} data={destinations} EditDialog={EditDialog} />
        ) : (
          <NoRecordsText message="No Destinations to show." />
        )}
      </CardContent>
    </Card>
  );
};
