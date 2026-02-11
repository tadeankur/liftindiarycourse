# Authentication Standards

## Provider

**This app uses [Clerk](https://clerk.com/) for authentication via `@clerk/nextjs`.** No other authentication provider or library should be used.

### Rules

- **ONLY** use Clerk for all authentication and user management
- **DO NOT** install alternative auth libraries (e.g. NextAuth, Auth.js, Lucia, Supabase Auth, etc.)
- **DO NOT** implement custom authentication logic (password hashing, session management, JWT handling, etc.)

## Setup

The root layout (`src/app/layout.tsx`) wraps the entire app in `<ClerkProvider>`. This is already configured and should not be duplicated or removed.

### Environment Variables

Clerk requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in the environment. These are stored in `.env.local` and must never be committed to version control.

## Getting the Authenticated User

**ALWAYS** use `auth()` from `@clerk/nextjs/server` in server components to get the current user's ID.

### Rules

- **ONLY** call `auth()` in server components, server actions, or middleware — never in client components
- **ALWAYS** check that `userId` is present before proceeding with authenticated logic
- **ALWAYS** redirect unauthenticated users away from protected pages
- **DO NOT** use `currentUser()` unless you specifically need the full user object (name, email, etc.) — prefer `auth()` for just the ID

### Example — Protected Server Component

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // userId is now guaranteed to be a string
  const data = await getData(userId);
  return <MyComponent data={data} />;
}
```

## UI Components

**ONLY** use Clerk's pre-built components for sign-in, sign-up, and user management UI.

### Rules

- **ONLY** use `<SignInButton>`, `<SignUpButton>`, `<SignedIn>`, `<SignedOut>`, and `<UserButton>` from `@clerk/nextjs`
- **DO NOT** build custom sign-in or sign-up forms
- **DO NOT** create custom user profile or account management pages
- Use `mode="modal"` on `<SignInButton>` and `<SignUpButton>` for modal-based auth flows

### Available Components

| Component       | Purpose                                      |
|-----------------|----------------------------------------------|
| `<SignInButton>` | Renders a sign-in trigger                   |
| `<SignUpButton>` | Renders a sign-up trigger                   |
| `<SignedIn>`     | Renders children only when authenticated     |
| `<SignedOut>`    | Renders children only when not authenticated |
| `<UserButton>`  | Renders the user avatar with account menu    |

## Middleware

If route protection via middleware is needed, use `clerkMiddleware` from `@clerk/nextjs/server` in `src/middleware.ts`. Follow the [Clerk middleware docs](https://clerk.com/docs/references/nextjs/clerk-middleware) for configuration.

### Rules

- **ONLY** use `clerkMiddleware` for route-level protection
- **DO NOT** write custom middleware for authentication checks
- Place the middleware file at `src/middleware.ts`
