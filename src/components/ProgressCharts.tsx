import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Workout, StrengthWorkout, BikeWorkout } from '../types/workout';

interface ProgressChartsProps {
  workoutType: string;
  onWorkoutTypeChange: (type: string) => void;
  selectedExercise: string;
  onExerciseChange: (exercise: string) => void;
  uniqueExercises: string[];
  workouts: Workout[];
}

export function ProgressCharts({
  workoutType,
  onWorkoutTypeChange,
  selectedExercise,
  onExerciseChange,
  uniqueExercises,
  workouts,
}: ProgressChartsProps) {
  const getProgressData = () => {
    if (workoutType === 'strength' && selectedExercise) {
      return workouts
        .filter((w): w is StrengthWorkout => w.type === 'strength' && w.exerciseName === selectedExercise)
        .map(w => {
          const maxWeight = Math.max(...w.sets.map(s => s.weight));
          const multiplier = w.isPerArm ? 2 : 1;
          const totalVolume = w.sets.reduce((sum, s) => sum + (s.weight * s.reps * multiplier), 0);
          return {
            date: new Date(w.date).toLocaleDateString(),
            maxWeight,
            totalVolume
          };
        })
        .slice(-10);
    } else if (workoutType === 'bike') {
      return workouts
        .filter((w): w is BikeWorkout => w.type === 'bike')
        .map(w => ({
          date: new Date(w.date).toLocaleDateString(),
          time: w.time,
          distance: w.distance
        }))
        .slice(-10);
    }
    return [];
  };

  const progressData = getProgressData();

  return (
    <>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => onWorkoutTypeChange('strength')}
          className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
            workoutType === 'strength'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Strength
        </button>
        <button
          onClick={() => onWorkoutTypeChange('bike')}
          className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
            workoutType === 'bike'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Bike
        </button>
      </div>

      {workoutType === 'strength' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Exercise</label>
          <select
            value={selectedExercise}
            onChange={(e) => onExerciseChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose an exercise</option>
            {uniqueExercises.map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
      )}

      {progressData.length > 0 ? (
        <div className="space-y-6">
          {workoutType === 'strength' ? (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Max Weight Per Session</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="maxWeight" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Total Volume Per Session</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalVolume" stroke="#7c3aed" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Time Progress</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="time" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Distance Progress</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="distance" stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp size={48} className="mx-auto mb-3 opacity-30" />
          <p>No data yet. Start logging workouts to see your progress!</p>
        </div>
      )}
    </>
  );
}
