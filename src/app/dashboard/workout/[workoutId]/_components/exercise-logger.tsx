"use client";

import { useRouter } from "next/navigation";
import {
  addExercise,
  removeExercise,
  addSet,
  updateSet,
  removeSet,
} from "../actions";
import { AddExerciseForm } from "./add-exercise-form";
import { ExerciseCard } from "./exercise-card";

export type SetData = {
  id: number;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
};

export type WorkoutExerciseData = {
  id: number;
  exercise: { id: number; name: string };
  sets: SetData[];
};

interface ExerciseLoggerProps {
  workoutId: number;
  workoutExercises: WorkoutExerciseData[];
}

export function ExerciseLogger({
  workoutId,
  workoutExercises,
}: ExerciseLoggerProps) {
  const router = useRouter();

  async function handleAddExercise(name: string) {
    await addExercise(workoutId, name);
    router.refresh();
  }

  async function handleRemoveExercise(workoutExerciseId: number) {
    await removeExercise(workoutExerciseId);
    router.refresh();
  }

  async function handleAddSet(
    workoutExerciseId: number,
    reps: number,
    weight: number
  ) {
    await addSet(workoutExerciseId, reps, weight);
    router.refresh();
  }

  async function handleUpdateSet(
    setId: number,
    data: { reps?: number; weight?: number; completed?: boolean }
  ) {
    await updateSet(setId, data);
    router.refresh();
  }

  async function handleRemoveSet(setId: number) {
    await removeSet(setId);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <AddExerciseForm onAdd={handleAddExercise} />
      {workoutExercises.map((we) => (
        <ExerciseCard
          key={we.id}
          workoutExercise={we}
          onRemoveExercise={handleRemoveExercise}
          onAddSet={handleAddSet}
          onUpdateSet={handleUpdateSet}
          onRemoveSet={handleRemoveSet}
        />
      ))}
    </div>
  );
}
