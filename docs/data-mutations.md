# Data Mutation Standards

## Server Actions ONLY

**ALL data mutations MUST be done via server actions.** This is the single allowed method for mutating data in this application. There are no exceptions.

### Rules

- **ONLY** mutate data through server actions
- **DO NOT** create or use Route Handlers (`route.ts`) for mutations
- **DO NOT** call database mutation functions directly from server components, layouts, or pages
- **DO NOT** use client-side `fetch` to trigger mutations

## Server Action File Colocation

**ALL server actions MUST live in colocated `actions.ts` files** next to the page or component that uses them.

### Rules

- **EVERY** server action file MUST be named `actions.ts`
- **EVERY** `actions.ts` file MUST start with `"use server";` at the top
- Place `actions.ts` in the same directory as the page that uses the actions
- **DO NOT** put server actions inline inside server components or page files
- **DO NOT** create a single global actions file — colocate actions with their page

### Example Structure

```
src/app/
  dashboard/
    page.tsx         - Server component (renders UI, fetches data)
    actions.ts       - Server actions for dashboard mutations
  workouts/
    page.tsx
    actions.ts       - Server actions for workout mutations
```

## Server Action Parameters

**ALL server action parameters MUST be explicitly typed. The `FormData` type is NOT allowed.**

### Rules

- **EVERY** server action MUST have typed parameters
- **DO NOT** use `FormData` as a parameter type
- **DO NOT** use `unknown`, `any`, or untyped parameters
- Define clear TypeScript types or interfaces for all action inputs
- If a form submits data, extract and type the values before calling the server action

### Correct — Typed parameters

```ts
"use server";

export async function createWorkout(userId: string, date: string) {
  // ...
}

export async function addSet(workoutExerciseId: string, weight: number, reps: number) {
  // ...
}
```

### WRONG — FormData or untyped parameters

```ts
"use server";

// DO NOT DO THIS — FormData is not allowed
export async function createWorkout(formData: FormData) {
  const date = formData.get("date");
  // ...
}

// DO NOT DO THIS — untyped parameters
export async function addSet(data: any) {
  // ...
}
```

## Zod Validation

**ALL server actions MUST validate their arguments using [Zod](https://zod.dev/).**

### Rules

- **EVERY** server action MUST validate all input arguments with a Zod schema before performing any mutation
- **DO NOT** trust arguments without validation — always parse with Zod first
- **DO NOT** use manual `if` checks or custom validation logic in place of Zod
- **DO NOT** install alternative validation libraries (e.g. yup, joi, superstruct, valibot)
- Define Zod schemas at the top of the `actions.ts` file or in a shared location if reused
- Use `z.parse()` or `z.safeParse()` — if validation fails, return an error to the caller

### Example Server Action with Zod Validation

```ts
"use server";

import { z } from "zod";
import { createWorkoutForUser } from "@/data/workouts";

const createWorkoutSchema = z.object({
  userId: z.string().min(1),
  date: z.string().date(),
});

export async function createWorkout(userId: string, date: string) {
  const parsed = createWorkoutSchema.parse({ userId, date });

  await createWorkoutForUser(parsed.userId, parsed.date);
}
```

## Database Mutations via `/data` Helper Functions

**ALL database mutation logic MUST go through helper functions in `src/data/`.** Server actions MUST NOT contain direct database calls.

### Rules

- **ONLY** perform database mutations through helper functions in `src/data/`
- **DO NOT** import `db` directly in `actions.ts` files
- **DO NOT** write Drizzle queries inside server actions
- **DO NOT** use raw SQL — **ALWAYS** use Drizzle ORM for all mutations
- Each helper function should be focused on a single mutation or closely related set of mutations
- All mutation helper functions MUST accept a `userId` parameter and use it to scope the operation

### Example Structure

```
src/data/
  workouts.ts    - Queries AND mutations related to workouts
  exercises.ts   - Queries AND mutations related to exercises
```

### Example Mutation Helper Function

```ts
import db from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkoutForUser(userId: string, date: string) {
  return db.insert(workouts).values({ userId, date }).returning();
}

export async function deleteWorkoutForUser(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## User Data Isolation — CRITICAL

**The same rules from `data-fetching.md` apply to mutations.** A user MUST only be able to mutate their own data.

### Rules

- **EVERY** mutation helper in `src/data/` MUST scope by the authenticated user's ID
- **NEVER** update or delete records without filtering by the user's ID
- **NEVER** trust user-provided IDs alone — always include the authenticated user's ID in the `WHERE` clause

### Correct — Scoped by userId

```ts
export async function deleteWorkoutForUser(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

### WRONG — Not scoped by userId

```ts
// DO NOT DO THIS — any user could delete any workout
export async function deleteWorkout(workoutId: string) {
  return db.delete(workouts).where(eq(workouts.id, workoutId));
}
```

## Post-Mutation Redirects

**ALL redirects after a server action MUST be done client-side.** Do not use `redirect()` inside server actions.

### Rules

- **DO NOT** call `redirect()` from `next/navigation` inside server actions
- **ALWAYS** perform redirects in the client component after the server action call resolves
- Use `useRouter().push()` from `next/navigation` in the client component to navigate after a successful mutation

### Correct — Client-side redirect

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createWorkout } from "./actions";

export function WorkoutForm() {
  const router = useRouter();

  async function handleSubmit() {
    await createWorkout("Push Day", "2025-09-01");
    router.push("/dashboard?date=2025-09-01");
  }

  return <button onClick={handleSubmit}>Create Workout</button>;
}
```

### WRONG — redirect() inside server action

```ts
"use server";

import { redirect } from "next/navigation";

export async function createWorkout(name: string, date: string) {
  // ... mutation logic ...

  // DO NOT DO THIS — redirect belongs on the client
  redirect(`/dashboard?date=${date}`);
}
```

## Full Example: End-to-End Mutation Flow

### 1. Data helper — `src/data/workouts.ts`

```ts
import db from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkoutForUser(userId: string, date: string) {
  return db.insert(workouts).values({ userId, date }).returning();
}
```

### 2. Server action — `src/app/dashboard/actions.ts`

```ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { createWorkoutForUser } from "@/data/workouts";

const createWorkoutSchema = z.object({
  date: z.string().date(),
});

export async function createWorkout(date: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createWorkoutSchema.parse({ date });

  return createWorkoutForUser(session.user.id, parsed.date);
}
```

### 3. Client component — `src/app/dashboard/workout-form.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createWorkout } from "./actions";

export function WorkoutForm() {
  const router = useRouter();

  async function handleSubmit() {
    await createWorkout("2025-09-01");
    router.push("/dashboard?date=2025-09-01");
  }

  return <button onClick={handleSubmit}>Create Workout</button>;
}
```
