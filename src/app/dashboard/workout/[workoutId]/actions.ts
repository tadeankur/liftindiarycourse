"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkoutForUser } from "@/data/workouts";

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
