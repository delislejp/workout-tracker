import { useState, useEffect } from 'react';
import type { Workout, StrengthWorkout, BikeWorkout } from '../types/workout';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

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

  const addWorkout = (workout: Workout) => {
    const updated = [...workouts, workout];
    saveWorkouts(updated);
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

  const getRecentWorkouts = (limit = 10) => {
    return [...workouts].reverse().slice(0, limit);
  };

  return {
    workouts,
    addWorkout,
    deleteWorkout,
    getUniqueExercises,
    getLastWorkout,
    getLastBikeWorkout,
    getRecentWorkouts,
  };
}
