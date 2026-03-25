"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function PropertyCalendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ before: new Date() }}
      />
    </div>
  );
}
