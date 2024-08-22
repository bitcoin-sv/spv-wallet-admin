import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DestinationEditDialog,
  destinationsColumns,
  NoRecordsText,
} from '@/components';
import { DestinationExtended } from '@/interfaces/destination.ts';
import { Destination } from '@bsv/spv-wallet-js-client';
import { Row } from '@tanstack/react-table';

export interface DestinationsTabContentProps {
  destinations: DestinationExtended[];
  hasDestinationEditDialog?: boolean;
}

export const DestinationsTabContent = ({ destinations, hasDestinationEditDialog }: DestinationsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Destinations</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {destinations.length > 0 ? (
          <DataTable
            columns={destinationsColumns}
            data={destinations}
            renderItem={(row) => hasDestinationEditDialog && <DestinationEditDialog row={row as Row<Destination>} />}
          />
        ) : (
          <NoRecordsText message="No Destinations to show." />
        )}
      </CardContent>
    </Card>
  );
};
