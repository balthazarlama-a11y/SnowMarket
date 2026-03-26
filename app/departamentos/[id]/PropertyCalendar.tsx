"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";

interface Reservation {
  start_date: string;
  end_date: string;
}

interface PropertyCalendarProps {
  reservations?: Reservation[];
}

export function PropertyCalendar({ reservations = [] }: PropertyCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

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
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={[{ before: new Date() }, ...disabledDates]}
        modifiers={{ booked: disabledDates }}
        modifiersClassNames={{ booked: "bg-red-100 text-red-400 line-through" }}
      />
    </div>
  );
}
