'use client';

import { useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const date = parse(selectedDate, 'yyyy-MM-dd', new Date());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date, 'PPP')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              router.push(
                `/dashboard?date=${format(newDate, 'yyyy-MM-dd')}`
              );
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
