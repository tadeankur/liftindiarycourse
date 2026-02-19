"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddSetFormProps {
  workoutExerciseId: number;
  onAdd: (workoutExerciseId: number, reps: number, weight: number) => Promise<void>;
}

export function AddSetForm({ workoutExerciseId, onAdd }: AddSetFormProps) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [pending, startTransition] = useTransition();

  const weightNum = parseFloat(weight);
  const repsNum = parseInt(reps, 10);
  const valid =
    !isNaN(weightNum) && weightNum >= 0 && !isNaN(repsNum) && repsNum > 0;

  function handleAdd() {
    if (!valid) return;
    startTransition(async () => {
      await onAdd(workoutExerciseId, repsNum, weightNum);
      setWeight("");
      setReps("");
    });
  }

  return (
    <div className="flex gap-2 mt-2">
      <Input
        type="number"
        placeholder="Weight (lbs)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        disabled={pending}
        className="w-32"
        min={0}
      />
      <Input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        disabled={pending}
        className="w-24"
        min={1}
      />
      <Button onClick={handleAdd} disabled={pending || !valid} size="sm">
        Add Set
      </Button>
    </div>
  );
}
