import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card } from '@/components/ui/card.tsx';

export const XpubsSkeleton = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Skeleton className="max-w-[124px] grow inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground" />
        <div className="flex">
          <Skeleton className="h-10 w-[336px] mr-6 rounded-md" />
          <Skeleton className="h-10 w-[111.5px] rounded-md" />
        </div>
      </div>
      <div>
        <Card className="p-6 pt-0 mb-2 mt-2">
          <div className="flex flex-col space-y-1.5 py-6 h-[72px]" />
          <div className="grid grid-cols-[4.5fr_1fr_1fr_1.5fr] gap-4">
            <Skeleton className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" />
            <Skeleton className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" />
            <Skeleton className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" />
            <Skeleton className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" />
          </div>

          <div className="grid grid-cols-[4.5fr_1fr_1fr_1.5fr] gap-4">
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
          </div>

          <div className="grid grid-cols-[4.5fr_1fr_1fr_1.5fr] gap-4">
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
          </div>

          <div className="grid grid-cols-[4.5fr_1fr_1fr_1.5fr] gap-4">
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
            <Skeleton className="h-14 w-full rounded-md mt-4" />
          </div>
        </Card>
      </div>
    </div>
  );
};
