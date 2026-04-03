"use client";

import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

interface Reservation {
  start_date: string;
  end_date: string;
}

interface PropertyCalendarProps {
  reservations?: Reservation[];
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

export function PropertyCalendar({
  reservations = [],
  selected,
  onSelect,
}: PropertyCalendarProps) {
  const disabledDates = useMemo(() => {
    const dates: Date[] = [];
    for (const r of reservations) {
      const start = new Date(r.start_date + "T00:00:00");
      const end = new Date(r.end_date + "T00:00:00");
      const current = new Date(start);
      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }
    return dates;
  }, [reservations]);

  return (
    <div className="flex justify-center">
      <Calendar
        mode="range"
        selected={selected}
        onSelect={onSelect}
        disabled={[{ before: new Date() }, ...disabledDates]}
        modifiers={{ booked: disabledDates }}
        modifiersClassNames={{ booked: "bg-red-100 text-red-400 line-through" }}
        numberOfMonths={1}
      />
    </div>
  );
}
