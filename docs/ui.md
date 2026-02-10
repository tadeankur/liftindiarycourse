# UI Coding Standards

## Component Library

**All UI components MUST use [shadcn/ui](https://ui.shadcn.com/).** No custom components should be created. If a UI element is needed, use the corresponding shadcn/ui component. If shadcn/ui does not provide the exact component, compose existing shadcn/ui components together to achieve the desired result.

### Rules

- **ONLY** use shadcn/ui components for all UI elements (buttons, inputs, dialogs, cards, tables, etc.)
- **DO NOT** create custom UI components
- **DO NOT** install alternative component libraries (e.g. Material UI, Chakra, Radix primitives directly, Mantine, etc.)
- When a new UI element is needed, install the relevant shadcn/ui component via `npx shadcn@latest add <component>`
- Compose multiple shadcn/ui components together when a single component does not cover the use case

## Date Formatting

All dates **MUST** be formatted using [date-fns](https://date-fns.org/).

### Required Date Format

Dates must follow ordinal day + abbreviated month + full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use the `format` function from `date-fns` with the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(new Date(2025, 8, 1), "do MMM yyyy"); // "1st Sep 2025"
format(new Date(2025, 7, 2), "do MMM yyyy"); // "2nd Aug 2025"
format(new Date(2026, 0, 3), "do MMM yyyy"); // "3rd Jan 2026"
format(new Date(2024, 5, 4), "do MMM yyyy"); // "4th Jun 2024"
```

- **DO NOT** use `Intl.DateTimeFormat`, `toLocaleDateString`, or manual string concatenation for date formatting
- **DO NOT** install alternative date libraries (e.g. moment, dayjs, luxon)
