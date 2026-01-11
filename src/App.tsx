import { useState } from 'react';
import { Layout } from './components/Layout';
import { WorkoutForm } from './components/WorkoutForm';
import { HistoryList } from './components/HistoryList';
import { ProgressCharts } from './components/ProgressCharts';
import { useWorkouts } from './hooks/useWorkouts';
import type { Workout } from './types/workout';

export default function WorkoutTracker() {
  const [view, setView] = useState('log');
  const [workoutType, setWorkoutType] = useState('strength');
  const [selectedExercise, setSelectedExercise] = useState('');

  const {
    workouts,
    addWorkout,
    deleteWorkout,
    getUniqueExercises,
    getLastWorkout,
    getLastBikeWorkout,
    getRecentWorkouts,
  } = useWorkouts();

  const handleLogWorkout = (workout: Workout) => {
    addWorkout(workout);
  };

  return (
    <Layout
      view={view}
      onViewChange={setView}
      workoutCount={workouts.length}
    >
      {view === 'log' ? (
        <>
          <WorkoutForm
            workoutType={workoutType}
            onWorkoutTypeChange={setWorkoutType}
            uniqueExercises={getUniqueExercises()}
            getLastWorkout={getLastWorkout}
            getLastBikeWorkout={getLastBikeWorkout}
            onLogWorkout={handleLogWorkout}
          />
          <HistoryList
            workouts={getRecentWorkouts()}
            onDelete={deleteWorkout}
          />
        </>
      ) : (
        <ProgressCharts
          workoutType={workoutType}
          onWorkoutTypeChange={setWorkoutType}
          selectedExercise={selectedExercise}
          onExerciseChange={setSelectedExercise}
          uniqueExercises={getUniqueExercises()}
          workouts={workouts}
        />
      )}
    </Layout>
  );
}