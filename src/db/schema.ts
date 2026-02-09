import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  real,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// ─── Workouts ────────────────────────────────────────────────

export const workouts = pgTable(
  'workouts',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    date: date('date').notNull(),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('workouts_user_id_idx').on(t.userId)],
);

// ─── Exercises (shared catalog) ──────────────────────────────

export const exercises = pgTable(
  'exercises',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex('exercises_name_idx').on(t.name)],
);

// ─── Workout Exercises (junction) ────────────────────────────

export const workoutExercises = pgTable(
  'workout_exercises',
  {
    id: serial('id').primaryKey(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('workout_exercises_workout_id_idx').on(t.workoutId),
    index('workout_exercises_exercise_id_idx').on(t.exerciseId),
  ],
);

// ─── Sets ────────────────────────────────────────────────────

export const sets = pgTable(
  'sets',
  {
    id: serial('id').primaryKey(),
    workoutExerciseId: integer('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    reps: integer('reps').notNull(),
    weight: real('weight').notNull(),
    completed: boolean('completed').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('sets_workout_exercise_id_idx').on(t.workoutExerciseId)],
);

// ─── Relations ───────────────────────────────────────────────

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  }),
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));
