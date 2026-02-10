"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

interface DashboardCalendarProps {
  date: Date;
}

export function DashboardCalendar({ date }: DashboardCalendarProps) {
  const router = useRouter();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(day) => {
        if (day) {
          router.push(`/dashboard?date=${format(day, "yyyy-MM-dd")}`);
        }
      }}
    />
  );
}
