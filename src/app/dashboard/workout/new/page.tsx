import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { NewWorkoutForm } from "./_components/new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const defaultDate = params.date;

  return (
    <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">New Workout</h1>
      <NewWorkoutForm defaultDate={defaultDate} />
    </main>
  );
}
