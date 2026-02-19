"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SetData } from "./exercise-logger";

interface SetRowProps {
  set: SetData;
  onUpdate: (
    setId: number,
    data: { reps?: number; weight?: number; completed?: boolean }
  ) => Promise<void>;
  onRemove: (setId: number) => Promise<void>;
}

export function SetRow({ set, onUpdate, onRemove }: SetRowProps) {
  const [pending, startTransition] = useTransition();

  function handleWeightBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val !== set.weight) {
      startTransition(() => onUpdate(set.id, { weight: val }));
    }
  }

  function handleRepsBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0 && val !== set.reps) {
      startTransition(() => onUpdate(set.id, { reps: val }));
    }
  }

  function handleToggleComplete() {
    startTransition(() => onUpdate(set.id, { completed: !set.completed }));
  }

  function handleRemove() {
    startTransition(() => onRemove(set.id));
  }

  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-2 py-1">
      <span className="text-sm text-muted-foreground text-center">
        {set.setNumber}
      </span>
      <Input
        type="number"
        defaultValue={set.weight}
        onBlur={handleWeightBlur}
        disabled={pending}
        min={0}
        className="h-8"
      />
      <Input
        type="number"
        defaultValue={set.reps}
        onBlur={handleRepsBlur}
        disabled={pending}
        min={1}
        className="h-8"
      />
      <Button
        size="sm"
        variant={set.completed ? "default" : "outline"}
        onClick={handleToggleComplete}
        disabled={pending}
        className="h-8 px-2"
      >
        {set.completed ? "✓" : "○"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRemove}
        disabled={pending}
        className="h-8 px-2 text-destructive hover:text-destructive"
      >
        ✕
      </Button>
    </div>
  );
}
