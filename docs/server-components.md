# Server Component Standards

## Async Params — CRITICAL

**In Next.js 15+, all route params are Promises and MUST be awaited.** This applies to `params` in pages, layouts, and `generateMetadata`. Accessing params without `await` will cause runtime errors.

### Rules

- **ALWAYS** `await` the `params` prop before accessing any values
- **ALWAYS** type `params` as `Promise<{ ... }>` in the function signature
- **DO NOT** destructure or access `params` properties without awaiting first
- **DO NOT** use `params.id` directly — always use `(await params).id` or await into a variable first
- This also applies to `searchParams` in page components — it is also a Promise

### Correct — Awaited params

```tsx
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;

  // Now safe to use workoutId
  const workout = await getWorkout(workoutId);

  return <div>{workout.name}</div>;
}
```

### Correct — Awaited searchParams

```tsx
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  return <div>Date: {date}</div>;
}
```

### WRONG — Accessing params without await

```tsx
// DO NOT DO THIS — params is a Promise in Next.js 15+
export default async function WorkoutPage({
  params,
}: {
  params: { workoutId: string };
}) {
  const workout = await getWorkout(params.workoutId); // WRONG — params not awaited
  return <div>{workout.name}</div>;
}
```

### WRONG — Typing params as a plain object

```tsx
// DO NOT DO THIS — params MUST be typed as a Promise
export default async function WorkoutPage({
  params,
}: {
  params: { workoutId: string }; // WRONG — should be Promise<{ workoutId: string }>
}) {
  // ...
}
```

## generateMetadata — Same Rules Apply

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;

  return { title: `Workout ${workoutId}` };
}
```

## Layout Params

```tsx
export default async function WorkoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;

  return <section>{children}</section>;
}
```
