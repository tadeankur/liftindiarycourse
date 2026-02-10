"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Set {
  id: number;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: number;
  order: number;
  exercise: {
    id: number;
    name: string;
  };
  sets: Set[];
}

export interface Workout {
  id: number;
  name: string;
  workoutExercises: WorkoutExercise[];
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workout.workoutExercises.map((we) => (
          <div key={we.id}>
            <p className="text-sm font-medium mb-2">{we.exercise.name}</p>
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Set</span>
              <span className="text-muted-foreground">Weight</span>
              <span className="text-muted-foreground">Reps</span>
              <span className="text-muted-foreground">Done</span>
              {we.sets.map((set) => (
                <div
                  key={set.id}
                  className="contents"
                >
                  <span>{set.setNumber}</span>
                  <span>{set.weight} lbs</span>
                  <span>{set.reps}</span>
                  <span>{set.completed ? "Yes" : "No"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
