import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Dumbbell, Bike, Calendar, Trash2, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkoutSet {
  weight: number;
  reps: number;
}

interface BaseWorkout {
  id: number;
  date: string;
  type: 'strength' | 'bike';
}

interface StrengthWorkout extends BaseWorkout {
  type: 'strength';
  exerciseName: string;
  isPerArm?: boolean;
  sets: WorkoutSet[];
}

interface BikeWorkout extends BaseWorkout {
  type: 'bike';
  time: number;
  distance: number;
}

type Workout = StrengthWorkout | BikeWorkout;

export default function WorkoutTracker() {
  const [view, setView] = useState('log');
  const [workoutType, setWorkoutType] = useState('strength');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  
  // Strength form states
  const [exerciseName, setExerciseName] = useState('');
  const [isNewExercise, setIsNewExercise] = useState(false);
  const [isPerArm, setIsPerArm] = useState(false);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [setWeight, setSetWeight] = useState('');
  const [setReps, setSetReps] = useState('');
  
  // Bike form states
  const [bikeTime, setBikeTime] = useState('');
  const [bikeDistance, setBikeDistance] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    try {
      const result = localStorage.getItem('workouts');
      if (result) {
        setWorkouts(JSON.parse(result));
      }
    } catch (error) {
      console.log('No previous workouts found');
    }
  };

  const saveWorkouts = (newWorkouts: Workout[]) => {
    try {
      localStorage.setItem('workouts', JSON.stringify(newWorkouts));
      setWorkouts(newWorkouts);
    } catch (error) {
      console.error('Failed to save workouts:', error);
    }
  };

  const addSet = () => {
    if (setWeight && setReps) {
      setCurrentSets([...currentSets, { 
        weight: parseFloat(setWeight), 
        reps: parseInt(setReps) 
      }]);
      // Keep previous values for next set
    }
  };

  const removeSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const logStrengthWorkout = () => {
    if (exerciseName && currentSets.length > 0) {
      const newWorkout: StrengthWorkout = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'strength',
        exerciseName,
        isPerArm,
        sets: currentSets
      };

      const updated = [...workouts, newWorkout];
      saveWorkouts(updated);

      // Reset form
      setExerciseName('');
      setIsNewExercise(false);
      setIsPerArm(false);
      setCurrentSets([]);
      setSetWeight('');
      setSetReps('');
    }
  };

  const logBikeWorkout = () => {
    const newWorkout: BikeWorkout = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'bike',
      time: parseInt(bikeTime),
      distance: parseFloat(bikeDistance) || 0
    };

    const updated = [...workouts, newWorkout];
    saveWorkouts(updated);

    setBikeTime('');
    setBikeDistance('');
  };

  const deleteWorkout = (id: number) => {
    const updated = workouts.filter(w => w.id !== id);
    saveWorkouts(updated);
  };

  const getUniqueExercises = () => {
    const exercises = workouts
      .filter((w): w is StrengthWorkout => w.type === 'strength')
      .map(w => w.exerciseName);
    return [...new Set(exercises)].sort();
  };

  const getLastWorkout = (exerciseName: string) => {
    return workouts
      .filter((w): w is StrengthWorkout => w.type === 'strength' && w.exerciseName === exerciseName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const getLastBikeWorkout = () => {
    return workouts
      .filter((w): w is BikeWorkout => w.type === 'bike')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const handleExerciseSelect = (exercise: string) => {
    setExerciseName(exercise);
    if (exercise && !isNewExercise) {
      const lastWorkout = getLastWorkout(exercise);
      if (lastWorkout) {
        setIsPerArm(!!lastWorkout.isPerArm);
        if (lastWorkout.sets.length > 0) {
          // Pre-fill with last set's values
          const lastSet = lastWorkout.sets[lastWorkout.sets.length - 1];
          setSetWeight(lastSet.weight.toString());
          setSetReps(lastSet.reps.toString());
        }
      } else {
        setIsPerArm(false);
      }
    } else {
      setIsPerArm(false);
    }
  };

  useEffect(() => {
    if (workoutType === 'bike' && !bikeTime) {
      const lastBike = getLastBikeWorkout();
      if (lastBike) {
        setBikeTime(lastBike.time.toString());
        if (lastBike.distance) {
          setBikeDistance(lastBike.distance.toString());
        }
      } else {
        setBikeTime('15');
      }
    }
  }, [workoutType]);

  const getProgressData = () => {
    if (workoutType === 'strength' && selectedExercise) {
      return workouts
        .filter((w): w is StrengthWorkout => w.type === 'strength' && w.exerciseName === selectedExercise)
        .map(w => {
          const multiplier = w.isPerArm ? 2 : 1;
          const maxWeight = Math.max(...w.sets.map(s => s.weight * multiplier));
          const totalVolume = w.sets.reduce((sum, s) => sum + (s.weight * multiplier * s.reps), 0);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const recentWorkouts = [...workouts].reverse().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell size={28} />
            Workout Tracker
          </h1>
          <p className="text-blue-100 text-sm mt-1">{workouts.length} total sessions logged</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setView('log')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 ${
              view === 'log' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <Plus size={20} />
            Log Workout
          </button>
          <button
            onClick={() => setView('progress')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 ${
              view === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <TrendingUp size={20} />
            Progress
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'log' ? (
            <>
              {/* Workout Type Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setWorkoutType('strength')}
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
                  onClick={() => setWorkoutType('bike')}
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
                <div className="space-y-4">
                  {/* Exercise Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                    {!isNewExercise && getUniqueExercises().length > 0 ? (
                      <div className="space-y-2">
                        <select
                          value={exerciseName}
                          onChange={(e) => handleExerciseSelect(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select an exercise</option>
                          {getUniqueExercises().map(ex => (
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
                        {getUniqueExercises().length > 0 && (
                          <button
                            onClick={() => {
                              setIsNewExercise(false);
                              setExerciseName('');
                              setIsPerArm(false);
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

                  {/* Per Arm Checkbox */}
                  {(isNewExercise || exerciseName) && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPerArm"
                        checked={isPerArm}
                        onChange={(e) => setIsPerArm(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPerArm" className="ml-2 block text-sm text-gray-700">
                        Weight is per arm
                      </label>
                    </div>
                  )}

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
                    onClick={logStrengthWorkout}
                    disabled={!exerciseName || currentSets.length === 0}
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Log Workout ({currentSets.length} set{currentSets.length !== 1 ? 's' : ''})
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time (minutes)</label>
                    <input
                      type="number"
                      value={bikeTime}
                      onChange={(e) => setBikeTime(e.target.value)}
                      placeholder="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km, optional)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bikeDistance}
                      onChange={(e) => setBikeDistance(e.target.value)}
                      placeholder="15.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={logBikeWorkout}
                    disabled={!bikeTime}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Log Workout
                  </button>
                </div>
              )}

              {/* Recent Workouts */}
              {recentWorkouts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar size={20} />
                    Recent Sessions
                  </h3>
                  <div className="space-y-2">
                    {recentWorkouts.map(workout => (
                      <div key={workout.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-gray-800">
                            {workout.type === 'strength' ? workout.exerciseName : 'Stationary Bike'}
                          </div>
                          <button
                            onClick={() => deleteWorkout(workout.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {workout.type === 'strength' ? (
                          <div className="text-sm text-gray-600 space-y-1">
                            {(workout as StrengthWorkout).isPerArm && (
                              <div className="text-xs font-medium text-blue-600 mb-1">(Weight per arm)</div>
                            )}
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
              )}
            </>
          ) : (
            <>
              {/* Progress View */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setWorkoutType('strength')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                    workoutType === 'strength'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Strength
                </button>
                <button
                  onClick={() => setWorkoutType('bike')}
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
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose an exercise</option>
                    {getUniqueExercises().map(ex => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                </div>
              )}

              {getProgressData().length > 0 ? (
                <div className="space-y-6">
                  {workoutType === 'strength' ? (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Max Weight Per Session</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={getProgressData()}>
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
                          <LineChart data={getProgressData()}>
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
                          <LineChart data={getProgressData()}>
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
                          <LineChart data={getProgressData()}>
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
          )}
        </div>
      </div>
    </div>
  );
}