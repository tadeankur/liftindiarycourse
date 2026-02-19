"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkoutForUser } from "@/data/workouts";
import { findOrCreateExercise } from "@/data/exercises";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "@/data/workout-exercises";
import {
  addSetToWorkoutExercise,
  updateSetForUser,
  removeSetForUser,
} from "@/data/sets";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(256),
  date: z.string().date(),
});

export async function updateWorkout(
  workoutId: number,
  name: string,
  date: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateWorkoutSchema.parse({ workoutId, name, date });
  await updateWorkoutForUser(userId, parsed.workoutId, {
    name: parsed.name,
    date: parsed.date,
  });
}

const addExerciseSchema = z.object({
  workoutId: z.number().int().positive(),
  exerciseName: z.string().min(1).max(256),
});

export async function addExercise(workoutId: number, exerciseName: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = addExerciseSchema.parse({ workoutId, exerciseName });
  const exercise = await findOrCreateExercise(parsed.exerciseName);
  if (!exercise) throw new Error("Failed to find or create exercise");

  await addExerciseToWorkout(userId, parsed.workoutId, exercise.id);
}

const removeExerciseSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
});

export async function removeExercise(workoutExerciseId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = removeExerciseSchema.parse({ workoutExerciseId });
  await removeExerciseFromWorkout(userId, parsed.workoutExerciseId);
}

const addSetSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().nonnegative(),
});

export async function addSet(
  workoutExerciseId: number,
  reps: number,
  weight: number
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = addSetSchema.parse({ workoutExerciseId, reps, weight });
  await addSetToWorkoutExercise(
    userId,
    parsed.workoutExerciseId,
    parsed.reps,
    parsed.weight
  );
}

const updateSetSchema = z.object({
  setId: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weight: z.number().nonnegative().optional(),
  completed: z.boolean().optional(),
});

export async function updateSet(
  setId: number,
  data: { reps?: number; weight?: number; completed?: boolean }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateSetSchema.parse({ setId, ...data });
  const { setId: id, ...rest } = parsed;
  await updateSetForUser(userId, id, rest);
}

const removeSetSchema = z.object({
  setId: z.number().int().positive(),
});

export async function removeSet(setId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = removeSetSchema.parse({ setId });
  await removeSetForUser(userId, parsed.setId);
}
