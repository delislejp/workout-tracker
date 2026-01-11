# Plan: Add "Per Arm" Weight Toggle

To support exercises where weight is specified per arm (e.g., Dumbbell Curls), we will add a toggle to the Strength form and update volume calculations.

## Steps

1.  **Update Data Model** in [src/App.tsx](src/App.tsx)
    - Add optional `isPerArm?: boolean;` to `StrengthWorkout` interface.

2.  **Add Form State** in [src/App.tsx](src/App.tsx)
    - Create state: `const [isPerArm, setIsPerArm] = useState(false);`
    - Reset this state in `logStrengthWorkout` (set to `false`).

3.  **Update UI** in [src/App.tsx](src/App.tsx)
    - Add a checkbox/toggle near the Exercise selector or Weight input.
    - Label it "Per Arm".

4.  **Persist Data** in [src/App.tsx](src/App.tsx)
    - Include `isPerArm` when creating the `newWorkout` object inside `logStrengthWorkout`.

5.  **Update Analytics** in [src/App.tsx](src/App.tsx)
    - In `getProgressData`, modify the volume calculation.
    - If `w.isPerArm` is true, multiply the weight by 2 for the volume sum.

6.  **Enhance History** in [src/App.tsx](src/App.tsx)
    - In `Recent Sessions` list, check `isPerArm`.
    - If true, display text like "(per arm)" or "( dumbbells)" next to the weight or exercise name to clarify the logged values.
