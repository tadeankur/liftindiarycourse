import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/edit-workout-form";

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
      <h1 className="text-3xl font-bold">Edit Workout</h1>
      <EditWorkoutForm
        workoutId={workout.id}
        initialName={workout.name}
        initialDate={workout.date}
      />
    </main>
  );
}
