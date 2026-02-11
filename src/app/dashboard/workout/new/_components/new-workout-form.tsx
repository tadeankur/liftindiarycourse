"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createWorkout } from "../actions";

interface NewWorkoutFormProps {
  defaultDate?: string;
}

export function NewWorkoutForm({ defaultDate }: NewWorkoutFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(
    defaultDate ? new Date(defaultDate + "T00:00:00") : new Date()
  );
  const [name, setName] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    await createWorkout(name.trim(), dateStr);
    router.push(`/dashboard?date=${dateStr}`);
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            placeholder="e.g. Push Day"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 size-4" />
                {date ? format(date, "do MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleSubmit} disabled={!name.trim() || !date} className="w-full">
          Create Workout
        </Button>
      </CardContent>
    </Card>
  );
}
