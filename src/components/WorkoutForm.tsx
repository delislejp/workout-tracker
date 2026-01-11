import { Dumbbell, Bike } from 'lucide-react';
import { StrengthForm } from './StrengthForm';
import { BikeForm } from './BikeForm';
import type { Workout, StrengthWorkout, BikeWorkout } from '../types/workout';

interface WorkoutFormProps {
  workoutType: string;
  onWorkoutTypeChange: (type: string) => void;
  uniqueExercises: string[];
  getLastWorkout: (exerciseName: string) => StrengthWorkout | undefined;
  getLastBikeWorkout: () => BikeWorkout | undefined;
  onLogWorkout: (workout: Workout) => void;
}

export function WorkoutForm({
  workoutType,
  onWorkoutTypeChange,
  uniqueExercises,
  getLastWorkout,
  getLastBikeWorkout,
  onLogWorkout,
}: WorkoutFormProps) {
  return (
    <>
      {/* Workout Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => onWorkoutTypeChange('strength')}
          className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            workoutType === 'strength'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Dumbbell size={20} />
          Strength
        </button>
        <button
          onClick={() => onWorkoutTypeChange('bike')}
          className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            workoutType === 'bike'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Bike size={20} />
          Bike
        </button>
      </div>

      {/* Form */}
      {workoutType === 'strength' ? (
        <StrengthForm
          uniqueExercises={uniqueExercises}
          getLastWorkout={getLastWorkout}
          onLogWorkout={onLogWorkout}
        />
      ) : (
        <BikeForm
          getLastBikeWorkout={getLastBikeWorkout}
          onLogWorkout={onLogWorkout}
        />
      )}
    </>
  );
}
