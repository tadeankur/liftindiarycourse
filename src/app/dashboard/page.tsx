"use client";

import { useState } from "react";
import { format } from "date-fns";

import { DatePicker } from "./_components/date-picker";
import { WorkoutList } from "./_components/workout-list";
import type { Workout } from "./_components/workout-card";

const MOCK_WORKOUTS: Record<string, Workout[]> = {
  [format(new Date(), "yyyy-MM-dd")]: [
    {
      id: 1,
      name: "Upper Body",
      exercises: [
        {
          name: "Bench Press",
          sets: [
            { setNumber: 1, reps: 10, weight: 135, completed: true },
            { setNumber: 2, reps: 8, weight: 155, completed: true },
            { setNumber: 3, reps: 6, weight: 175, completed: false },
          ],
        },
        {
          name: "Overhead Press",
          sets: [
            { setNumber: 1, reps: 10, weight: 65, completed: true },
            { setNumber: 2, reps: 8, weight: 75, completed: true },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Core Work",
      exercises: [
        {
          name: "Plank Hold",
          sets: [
            { setNumber: 1, reps: 1, weight: 0, completed: true },
            { setNumber: 2, reps: 1, weight: 0, completed: true },
          ],
        },
      ],
    },
  ],
};

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const key = format(date, "yyyy-MM-dd");
  const workouts = MOCK_WORKOUTS[key] ?? [];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <DatePicker date={date} onDateChange={setDate} />
      </div>
      <WorkoutList workouts={workouts} />
    </main>
  );
}
