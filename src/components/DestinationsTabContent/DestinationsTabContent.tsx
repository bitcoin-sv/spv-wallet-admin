import { Card, CardContent, CardHeader, CardTitle, DataTable, destinationsColumns, NoRecordsText } from '@/components';
import { DestinationExtended } from '@/interfaces/destination.ts';

export interface DestinationsTabContentProps {
  destinations: DestinationExtended[];
}
export const DestinationsTabContent = ({ destinations }: DestinationsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Destinations</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        {destinations.length > 0 ? (
          <DataTable columns={destinationsColumns} data={destinations} />
        ) : (
          <NoRecordsText message="No Destinations to show." />
        )}
      </CardContent>
    </Card>
  );
};
