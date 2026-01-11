import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { WorkoutSet, StrengthWorkout } from '../types/workout';

interface StrengthFormProps {
  uniqueExercises: string[];
  getLastWorkout: (exerciseName: string) => StrengthWorkout | undefined;
  onLogWorkout: (workout: StrengthWorkout) => void;
}

export function StrengthForm({ uniqueExercises, getLastWorkout, onLogWorkout }: StrengthFormProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [isNewExercise, setIsNewExercise] = useState(false);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [setWeight, setSetWeight] = useState('');
  const [setReps, setSetReps] = useState('');

  const addSet = () => {
    if (setWeight && setReps) {
      setCurrentSets([...currentSets, { 
        weight: parseFloat(setWeight), 
        reps: parseInt(setReps) 
      }]);
    }
  };

  const removeSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const logWorkout = () => {
    if (exerciseName && currentSets.length > 0) {
      const newWorkout: StrengthWorkout = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'strength',
        exerciseName,
        sets: currentSets
      };

      onLogWorkout(newWorkout);

      setExerciseName('');
      setIsNewExercise(false);
      setCurrentSets([]);
      setSetWeight('');
      setSetReps('');
    }
  };

  const handleExerciseSelect = (exercise: string) => {
    setExerciseName(exercise);
    if (exercise && !isNewExercise) {
      const lastWorkout = getLastWorkout(exercise);
      if (lastWorkout && lastWorkout.sets.length > 0) {
        const lastSet = lastWorkout.sets[lastWorkout.sets.length - 1];
        setSetWeight(lastSet.weight.toString());
        setSetReps(lastSet.reps.toString());
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Exercise Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
        {!isNewExercise && uniqueExercises.length > 0 ? (
          <div className="space-y-2">
            <select
              value={exerciseName}
              onChange={(e) => handleExerciseSelect(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an exercise</option>
              {uniqueExercises.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
            <button
              onClick={() => setIsNewExercise(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add new exercise
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="e.g., Bench Press"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {uniqueExercises.length > 0 && (
              <button
                onClick={() => {
                  setIsNewExercise(false);
                  setExerciseName('');
                  setSetWeight('');
                  setSetReps('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← Choose from existing exercises
              </button>
            )}
          </div>
        )}
      </div>

      {/* Current Sets Display */}
      {currentSets.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Sets</h4>
          <div className="space-y-2">
            {currentSets.map((set, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                <span className="text-sm">
                  Set {index + 1}: <strong>{set.weight} lbs</strong> × <strong>{set.reps} reps</strong>
                </span>
                <button
                  onClick={() => removeSet(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Set Form */}
      {exerciseName && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={setWeight}
                onChange={(e) => setSetWeight(e.target.value)}
                placeholder="135"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
              <input
                type="number"
                value={setReps}
                onChange={(e) => setSetReps(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={addSet}
            disabled={!setWeight || !setReps}
            className="w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg font-semibold hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Set
          </button>
        </>
      )}

      <button
        onClick={logWorkout}
        disabled={!exerciseName || currentSets.length === 0}
        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Log Workout ({currentSets.length} set{currentSets.length !== 1 ? 's' : ''})
      </button>
    </div>
  );
}
