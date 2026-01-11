import { useState, useEffect } from 'react';
import type { BikeWorkout } from '../types/workout';

interface BikeFormProps {
  getLastBikeWorkout: () => BikeWorkout | undefined;
  onLogWorkout: (workout: BikeWorkout) => void;
}

export function BikeForm({ getLastBikeWorkout, onLogWorkout }: BikeFormProps) {
  const [bikeTime, setBikeTime] = useState('');
  const [bikeDistance, setBikeDistance] = useState('');

  useEffect(() => {
    if (!bikeTime) {
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
  }, []);

  const logWorkout = () => {
    const newWorkout: BikeWorkout = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'bike',
      time: parseInt(bikeTime),
      distance: parseFloat(bikeDistance) || 0
    };

    onLogWorkout(newWorkout);

    setBikeTime('');
    setBikeDistance('');
  };

  return (
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
        onClick={logWorkout}
        disabled={!bikeTime}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Log Workout
      </button>
    </div>
  );
}
