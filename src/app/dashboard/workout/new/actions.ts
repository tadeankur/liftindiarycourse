"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkoutForUser } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(256),
  date: z.string().date(),
});

export async function createWorkout(name: string, date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = createWorkoutSchema.parse({ name, date });
  await createWorkoutForUser(userId, parsed.name, parsed.date);
}
