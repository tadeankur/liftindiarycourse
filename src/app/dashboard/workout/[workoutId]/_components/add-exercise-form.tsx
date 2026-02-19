"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddExerciseFormProps {
  onAdd: (name: string) => Promise<void>;
}

export function AddExerciseForm({ onAdd }: AddExerciseFormProps) {
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await onAdd(trimmed);
      setName("");
    });
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Exercise name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={pending}
      />
      <Button onClick={handleSubmit} disabled={pending || !name.trim()}>
        Add
      </Button>
    </div>
  );
}
