# Data Fetching Standards

## Server Components ONLY

**ALL data fetching MUST be done in server components.** This is the single allowed method for fetching data in this application. There are no exceptions.

### Rules

- **ONLY** fetch data in React Server Components
- **DO NOT** fetch data in client components (`"use client"`)
- **DO NOT** create or use Route Handlers (`route.ts`) for data fetching
- **DO NOT** use `useEffect`, `fetch` on the client, React Query, SWR, or any client-side data fetching library
- **DO NOT** create API routes that return data to the frontend
- If a client component needs data, pass it down as props from a parent server component

## Database Queries via `/data` Helper Functions


### Rules

- **ONLY** query the database through helper functions in `src/data/`
- **DO NOT** write database queries directly in server components, layouts, or pages
- **DO NOT** use raw SQL — **ALWAYS** use Drizzle ORM for all queries
- Each helper function should be focused on a single query or closely related set of queries
- Server components call these helper functions to get their data

### Example Structure

```
src/data/
  workouts.ts    - Queries related to workouts
  exercises.ts   - Queries related to exercises
```

### Example Helper Function

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

### Example Server Component Usage

```tsx
import { getWorkouts } from "@/data/workouts";
import { auth } from "@/lib/auth"; // however auth is configured

export default async function WorkoutsPage() {
  const session = await auth();
  const workouts = await getWorkouts(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

## User Data Isolation — CRITICAL

**A logged-in user MUST only be able to access their own data.** This is a security requirement that applies to every single query.

### Rules

- **EVERY** query in `src/data/` MUST filter by the authenticated user's ID
- **NEVER** return data that belongs to another user
- **NEVER** trust user-provided IDs without verifying ownership — always include the authenticated user's ID in the `WHERE` clause
- When fetching a single record by ID, **ALWAYS** also filter by the user's ID to prevent unauthorized access
- All helper functions in `src/data/` MUST accept a `userId` parameter and use it to scope queries

### Correct — Always scope by userId

```ts
export async function getWorkout(workoutId: string, userId: string) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

### WRONG — Never fetch without userId

```ts
// DO NOT DO THIS — any user could access any workout
export async function getWorkout(workoutId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId));All database queries MUST go through helper functions located in the `src/data/` directory.

}
```
