import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';

import { getWorkoutsByDate } from '@/db/queries';
import { DatePicker } from './_components/date-picker';
import { WorkoutList } from './_components/workout-list';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/');

  const params = await searchParams;
  const dateParam = params.date ?? format(new Date(), 'yyyy-MM-dd');

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const date = dateRegex.test(dateParam)
    ? dateParam
    : format(new Date(), 'yyyy-MM-dd');

  const workouts = await getWorkoutsByDate(userId, date);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <DatePicker selectedDate={date} />
      </div>
      <WorkoutList workouts={workouts} />
    </main>
  );
}
