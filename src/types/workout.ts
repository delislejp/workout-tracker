export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface BaseWorkout {
  id: number;
  date: string;
  type: 'strength' | 'bike';
}

export interface StrengthWorkout extends BaseWorkout {
  type: 'strength';
  exerciseName: string;
  isPerArm?: boolean;
  sets: WorkoutSet[];
}

export interface BikeWorkout extends BaseWorkout {
  type: 'bike';
  time: number;
  distance: number;
}

export type Workout = StrengthWorkout | BikeWorkout;
