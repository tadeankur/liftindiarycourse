import db from "@/db";
import { sets, workoutExercises } from "@/db/schema";
import { eq, max } from "drizzle-orm";

async function verifySetOwnership(userId: string, workoutExerciseId: number) {
  const we = await db.query.workoutExercises.findFirst({
    where: eq(workoutExercises.id, workoutExerciseId),
    with: { workout: true },
  });
  if (!we || we.workout.userId !== userId) throw new Error("Not found");
  return we;
}

export async function addSetToWorkoutExercise(
  userId: string,
  workoutExerciseId: number,
  reps: number,
  weight: number
) {
  await verifySetOwnership(userId, workoutExerciseId);

  const result = await db
    .select({ maxSetNumber: max(sets.setNumber) })
    .from(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId));

  const nextSetNumber = (result[0]?.maxSetNumber ?? 0) + 1;

  return db
    .insert(sets)
    .values({ workoutExerciseId, reps, weight, setNumber: nextSetNumber })
    .returning();
}

export async function updateSetForUser(
  userId: string,
  setId: number,
  data: { reps?: number; weight?: number; completed?: boolean }
) {
  const set = await db.query.sets.findFirst({
    where: eq(sets.id, setId),
    with: { workoutExercise: { with: { workout: true } } },
  });
  if (!set || set.workoutExercise.workout.userId !== userId)
    throw new Error("Not found");

  return db.update(sets).set(data).where(eq(sets.id, setId)).returning();
}

export async function removeSetForUser(userId: string, setId: number) {
  const set = await db.query.sets.findFirst({
    where: eq(sets.id, setId),
    with: { workoutExercise: { with: { workout: true } } },
  });
  if (!set || set.workoutExercise.workout.userId !== userId)
    throw new Error("Not found");

  return db.delete(sets).where(eq(sets.id, setId));
}
