import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/edit-workout-form";
import { ExerciseLogger } from "./_components/exercise-logger";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { workoutId } = await params;
  const id = Number(workoutId);
  if (Number.isNaN(id)) notFound();

  const workout = await getWorkoutById(userId, id);
  if (!workout) notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{workout.name}</h1>
      <EditWorkoutForm
        workoutId={workout.id}
        initialName={workout.name}
        initialDate={workout.date}
      />
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Exercises</h2>
        <ExerciseLogger
          workoutId={workout.id}
          workoutExercises={workout.workoutExercises}
        />
      </section>
    </main>
  );
}
