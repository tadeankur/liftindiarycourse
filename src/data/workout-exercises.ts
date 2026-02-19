import db from "@/db";
import { workouts, workoutExercises } from "@/db/schema";
import { eq, and, max } from "drizzle-orm";

export async function addExerciseToWorkout(
  userId: string,
  workoutId: number,
  exerciseId: number
) {
  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
  if (!workout) throw new Error("Workout not found");

  const result = await db
    .select({ maxOrder: max(workoutExercises.order) })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));

  const nextOrder = (result[0]?.maxOrder ?? 0) + 1;

  return db
    .insert(workoutExercises)
    .values({ workoutId, exerciseId, order: nextOrder })
    .returning();
}

export async function removeExerciseFromWorkout(
  userId: string,
  workoutExerciseId: number
) {
  const we = await db.query.workoutExercises.findFirst({
    where: eq(workoutExercises.id, workoutExerciseId),
    with: { workout: true },
  });
  if (!we || we.workout.userId !== userId) throw new Error("Not found");

  return db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));
}
