import db from "@/db";
import { exercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findOrCreateExercise(name: string) {
  const trimmed = name.trim();

  await db
    .insert(exercises)
    .values({ name: trimmed })
    .onConflictDoNothing();

  return db.query.exercises.findFirst({
    where: eq(exercises.name, trimmed),
  });
}
