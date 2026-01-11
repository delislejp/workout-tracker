import { Calendar, Trash2 } from 'lucide-react';
import type { Workout, StrengthWorkout, BikeWorkout } from '../types/workout';

interface HistoryListProps {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export function HistoryList({ workouts, onDelete }: HistoryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  if (workouts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Calendar size={20} />
        Recent Sessions
      </h3>
      <div className="space-y-2">
        {workouts.map(workout => (
          <div key={workout.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-gray-800">
                {workout.type === 'strength' ? (
                  <>
                    {(workout as StrengthWorkout).exerciseName}
                    {(workout as StrengthWorkout).isPerArm && (
                      <span className="text-xs text-blue-600 font-medium ml-2 bg-blue-50 px-1.5 py-0.5 rounded">Per Arm</span>
                    )}
                  </>
                ) : 'Stationary Bike'}
              </div>
              <button
                onClick={() => onDelete(workout.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {workout.type === 'strength' ? (
              <div className="text-sm text-gray-600 space-y-1">
                {(workout as StrengthWorkout).sets.map((set, i) => (
                  <div key={i}>Set {i + 1}: {set.weight} lbs × {set.reps} reps</div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {(workout as BikeWorkout).time} min{(workout as BikeWorkout).distance ? ` • ${(workout as BikeWorkout).distance} km` : ''}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">{formatDate(workout.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
