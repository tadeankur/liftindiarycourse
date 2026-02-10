import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { getWorkoutsByDate } from "@/data/workouts";
import { DashboardCalendar } from "./_components/dashboard-calendar";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <Card>
            <CardContent className="flex justify-center p-4">
              <DashboardCalendar date={date} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <WorkoutList workouts={workouts} />
        </div>
      </div>
    </main>
  );
}
