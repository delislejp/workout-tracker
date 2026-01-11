import type { ReactNode } from 'react';
import { Plus, TrendingUp, Dumbbell } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  view: string;
  onViewChange: (view: string) => void;
  workoutCount: number;
}

export function Layout({ children, view, onViewChange, workoutCount }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell size={28} />
            Workout Tracker
          </h1>
          <p className="text-blue-100 text-sm mt-1">{workoutCount} total sessions logged</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => onViewChange('log')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 ${
              view === 'log' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <Plus size={20} />
            Log Workout
          </button>
          <button
            onClick={() => onViewChange('progress')}
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
          {children}
        </div>
      </div>
    </div>
  );
}
