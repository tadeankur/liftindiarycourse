import { CheckCircle2, Circle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { getWorkoutsByDate } from '@/db/queries';

type Workout = Awaited<ReturnType<typeof getWorkoutsByDate>>[number];

export function WorkoutCard({ workout }: { workout: Workout }) {
  const isCompleted = !!workout.completedAt;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
          {workout.name}
        </CardTitle>
        <CardDescription>
          {isCompleted ? 'Completed' : 'In progress'}
          {workout.workoutExercises.length > 0 &&
            ` \u00B7 ${workout.workoutExercises.length} exercise${workout.workoutExercises.length === 1 ? '' : 's'}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workout.workoutExercises.map((we) => (
          <div key={we.id}>
            <h4 className="text-sm font-medium mb-2">{we.exercise.name}</h4>
            {we.sets.length > 0 && (
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-medium">Set</span>
                <span className="font-medium">Weight</span>
                <span className="font-medium">Reps</span>
                <span className="font-medium sr-only">Status</span>
                {we.sets.map((set) => (
                  <div key={set.id} className="contents">
                    <span>{set.setNumber}</span>
                    <span>{set.weight} lbs</span>
                    <span>{set.reps}</span>
                    <span>
                      {set.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
