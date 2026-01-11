# Workout Tracker Development Plan

## Project Overview
A progressive web app (PWA) for tracking strength and cardio workouts, built with React, Vite, and Tailwind CSS. The app persists data locally and is deployed to GitHub Pages.

## Current State
- [x] **Project Setup**: Vite + React + TypeScript + Tailwind CSS (v4).
- [x] **Core Features**:
  - [x] Log Strength Workouts (Exercise name, dynamic sets w/ weight & reps).
  - [x] Log Cardio Workouts (Bike: Time & Distance).
  - [x] "Recent Sessions" list with delete functionality.
  - [x] Progress visualization using Recharts (Max Weight, Volume, Time, Distance).
  - [x] Automatic "last set" and "last session" pre-filling for convenience.
- [x] **Data Persistence**: `localStorage` used for saving workouts.
- [x] **Infrastructure**:
  - [x] GitHub Pages deployment via `gh-pages`.
  - [x] PWA support (Manifest, Icons, Service Worker) using `vite-plugin-pwa`.
  - [x] CI/CD via manual `npm run deploy` script.

## Technical Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts

## Roadmap & Refinement Opportunities

### 1. Refactoring (High Priority)
- The entire application logic currently resides in `App.tsx`.
- **Action**: Split into sub-components:
  - `components/Layout.tsx`
  - `components/WorkoutForm.tsx` (Split further into Strength/Bike forms)
  - `components/HistoryList.tsx`
  - `components/ProgressCharts.tsx`
- **Action**: Extract logic into custom hooks (e.g., `useWorkouts`).

### 2. Feature Enhancements
- [x] **Per Arm Toggle**: Option to specify if weight is per arm (e.g. dumbbells) for accurate volume calculation.
- [ ] **Edit Functionality**: Allow users to edit details of a logged workout.
- [ ] **More Activity Types**: Support Running, Swimming, etc.
- [ ] **Data Management**:
  - [ ] internal Import/Export of data (JSON) so users don't lose data on cache clear.
  - [ ] Cloud sync (requires backend/Auth).
- [ ] **Advanced Analytics**:
  - [ ] 1RM (One Rep Max) estimation.
  - [ ] Weekly/Monthly volume aggregation.

### 3. UI/UX Improvements
- [ ] Add toast notifications for "Workout Saved" or "Deleted".
- [ ] Implement a calendar view for workout history.
- [ ] Dark mode toggle (Tailwind config exists, need UI toggle).
