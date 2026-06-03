import { WeeklyFocus, DailyTask, NutritionItem } from '../types';

export const MOTIVATIONAL_QUOTES = [
  "Today's discipline becomes tomorrow's medal.",
  "Champions are built one practice at a time.",
  "Every lap makes you stronger.",
  "Consistency beats talent when talent skips practice.",
  "Small steps every day lead to big results.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't practice until you get it right. Practice until you can't get it wrong.",
  "Hard work beats talent when talent doesn't work hard."
];

export const WEEKLY_FOCUS: WeeklyFocus[] = [
  {
    week: 1,
    title: "Cross Leg Mastery",
    drills: ["Crossovers", "Inside Edge", "Outside Edge", "Corner Control"],
    description: "Improve edge control and crossover efficiency."
  },
  {
    week: 2,
    title: "Double Push Technique",
    drills: ["Weight Transfer", "Push Timing", "Recovery Position", "Speed Generation"],
    description: "Improve skating efficiency and speed."
  },
  {
    week: 3,
    title: "Left Knee Strengthening",
    drills: ["Single Leg Balance", "Controlled Squats", "Stability Work", "Mobility Exercises"],
    description: "Improve stability and injury prevention."
  },
  {
    week: 4,
    title: "Race Simulation",
    drills: ["Sprint Starts", "Corner Entry", "Race Pace", "Endurance"],
    description: "Combine all learned skills."
  }
];

export const DEFAULT_TASKS: Omit<DailyTask, 'id' | 'completed'>[] = [
  { label: 'Wake Up 5:00 AM', category: 'morning' },
  { label: 'Brush & Hygiene', category: 'morning' },
  { label: 'Leave Home 5:30 AM', category: 'morning' },
  { label: 'Off Skate Training', category: 'training' },
  { label: 'On Skate Training', category: 'training' },
  { label: 'Stretching', category: 'training' },
  { label: 'School Work', category: 'education' },
  { label: 'Sleep Before 9 PM', category: 'recovery' },
];

export const DEFAULT_NUTRITION: Omit<NutritionItem, 'id' | 'completed'>[] = [
  { label: 'Protein Source', category: 'breakfast' },
  { label: 'Calcium Source', category: 'breakfast' },
  { label: 'Fruit', category: 'breakfast' },
  { label: 'Protein Source', category: 'lunch' },
  { label: 'Vegetables', category: 'lunch' },
  { label: 'Complex Carbohydrates', category: 'lunch' },
  { label: 'Protein Source', category: 'dinner' },
  { label: 'Vegetables', category: 'dinner' },
];
