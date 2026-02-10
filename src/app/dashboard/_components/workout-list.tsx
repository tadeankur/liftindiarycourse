"use client";

import { WorkoutCard, type Workout } from "./workout-card";

interface WorkoutListProps {
  workouts: Workout[];
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No workouts logged for this date.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
