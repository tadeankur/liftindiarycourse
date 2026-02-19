import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./_components/date-picker";
import { WorkoutList } from "./_components/workout-list";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const dateStr = params.date ?? format(new Date(), "yyyy-MM-dd");
  const date = new Date(dateStr + "T00:00:00");

  const workouts = await getWorkoutsByDate(userId, dateStr);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Workout Dashboard</h1>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <DatePicker date={date} />
          <Button asChild>
            <Link href="/dashboard/workout/new">Log New Workout</Link>
          </Button>
        </div>
        <WorkoutList workouts={workouts} />
      </div>
    </main>
  );
}
