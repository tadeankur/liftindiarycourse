import { Dumbbell } from 'lucide-react';
import { WorkoutCard } from './workout-card';
import type { getWorkoutsByDate } from '@/db/queries';

type Workout = Awaited<ReturnType<typeof getWorkoutsByDate>>[number];

export function WorkoutList({ workouts }: { workouts: Workout[] }) {
  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Dumbbell className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No workouts for this day</p>
        <p className="text-sm">Select a different date or log a new workout.</p>
      </div>
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
