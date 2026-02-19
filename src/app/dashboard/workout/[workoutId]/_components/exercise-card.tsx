"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetRow } from "./set-row";
import { AddSetForm } from "./add-set-form";
import type { WorkoutExerciseData } from "./exercise-logger";

interface ExerciseCardProps {
  workoutExercise: WorkoutExerciseData;
  onRemoveExercise: (workoutExerciseId: number) => Promise<void>;
  onAddSet: (workoutExerciseId: number, reps: number, weight: number) => Promise<void>;
  onUpdateSet: (
    setId: number,
    data: { reps?: number; weight?: number; completed?: boolean }
  ) => Promise<void>;
  onRemoveSet: (setId: number) => Promise<void>;
}

export function ExerciseCard({
  workoutExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
}: ExerciseCardProps) {
  const [pending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(() => onRemoveExercise(workoutExercise.id));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <span className="font-semibold">{workoutExercise.exercise.name}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          disabled={pending}
          className="text-destructive hover:text-destructive"
        >
          Remove
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {workoutExercise.sets.length > 0 && (
          <div className="mb-1">
            <div className="grid grid-cols-[2rem_1fr_1fr_auto_auto] gap-2 text-xs text-muted-foreground mb-1">
              <span className="text-center">Set</span>
              <span>Weight (lbs)</span>
              <span>Reps</span>
              <span>Done</span>
              <span></span>
            </div>
            {workoutExercise.sets.map((set) => (
              <SetRow
                key={set.id}
                set={set}
                onUpdate={onUpdateSet}
                onRemove={onRemoveSet}
              />
            ))}
          </div>
        )}
        <AddSetForm workoutExerciseId={workoutExercise.id} onAdd={onAddSet} />
      </CardContent>
    </Card>
  );
}
