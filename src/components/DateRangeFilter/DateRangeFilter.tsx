import { LoadingSpinner } from '@/components';
import { Button } from '@/components/ui';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { cn } from '@/lib/utils.ts';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { addDays, format, subDays } from 'date-fns';
import { Calendar as CalendarIcon, ListFilter } from 'lucide-react';

import React, { useState } from 'react';

import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

export interface DateRangeFilterProps {
  withRevokedRange?: boolean;
  className?: string;
}

const initialTimeRange = () => {
  const currentDate = new Date();
  return {
    from: subDays(currentDate, 20),
    to: currentDate,
  };
};

export const DateRangeFilter = ({ withRevokedRange, className }: DateRangeFilterProps) => {
  const [dateRangeOption, setDateRangeOption] = useState<string>('createdRange');
  const [date, setDate] = React.useState<DateRange | undefined>(initialTimeRange);
  const [isLoading, setIsLoading] = useState(false);

  const {
    search: { updatedRange, createdRange, revokedRange },
  } = useLocation();

  const navigate = useNavigate();

  const onApplyDateRange = () => {
    setIsLoading(true);
    navigate({
      search: (old) => {
        if ('createdRange' in old) {
          delete old.createdRange;
        }
        if ('updatedRange' in old) {
          delete old.updatedRange;
        }
        if ('revokedRange' in old) {
          delete old.revokedRange;
        }

        return {
          ...old,
          [dateRangeOption]: {
            from: date!.from,
            to: addDays(date!.to!, 1),
          },
        };
      },
      replace: true,
    })
      .then(() => {
        toast.success('Date range applied');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onClearDateRange = () => {
    setIsLoading(true);
    navigate({
      search: (old) => {
        if ('createdRange' in old) {
          delete old.createdRange;
        }
        if ('updatedRange' in old) {
          delete old.updatedRange;
        }
        if ('revokedRange' in old) {
          delete old.revokedRange;
        }
        return {
          ...old,
        };
      },
      replace: true,
    })
      .then(() => {
        toast.success('Date range cleared');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        <Button variant="outline">
          <ListFilter className="w-5 h-5" />
          <span className="ml-2">Filter</span>
          {createdRange || updatedRange || revokedRange ? (
            <span className="ml-2 bg-black/80 rounded-full text-white h-6 w-6 text-xs flex justify-center items-center">
              1
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Date ranges</h4>
            <p className="text-sm text-muted-foreground">Set date ranges to filter keys.</p>
          </div>
        </div>
        <div className="mt-4">
          <RadioGroup defaultValue={dateRangeOption} onValueChange={setDateRangeOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="createdRange" id="r1" />
              <Label htmlFor="r1">Created date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="updatedRange" id="r2" />
              <Label htmlFor="r2">Updated date</Label>
            </div>
            {withRevokedRange && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="revokedRange" id="r3" />
                <Label htmlFor="r3">Revoked date</Label>
              </div>
            )}
          </RadioGroup>
        </div>
        <div className={cn('grid gap-2 mt-4')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={onApplyDateRange} className="mt-4 w-full" variant="default" disabled={isLoading}>
          Apply {isLoading && <LoadingSpinner className="ml-2" />}
        </Button>
        <Button onClick={onClearDateRange} className="mt-4 w-full" variant="secondary" disabled={isLoading}>
          Reset {isLoading && <LoadingSpinner className="ml-2" />}
        </Button>
        <div className="font-medium leading-none mt-4 text-sm">
          Applied Filters: {createdRange && 'Created Range'}
          {updatedRange && 'Updated Range'}
          {revokedRange && 'Revoked Range'}
        </div>
      </PopoverContent>
    </Popover>
  );
};
