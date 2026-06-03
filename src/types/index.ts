export type TaskStatus = 'pending' | 'completed';

export interface DailyTask {
  id: string;
  label: string;
  category: 'morning' | 'training' | 'education' | 'recovery';
  completed: boolean;
}

export interface NutritionItem {
  id: string;
  label: string;
  category: 'breakfast' | 'lunch' | 'dinner';
  completed: boolean;
}

export interface SleepData {
  bedTime: string;
  wakeTime: string;
  hours: number;
  score: 'excellent' | 'good' | 'needs-improvement';
}

export interface HydrationData {
  glasses: number;
}

export interface DailyRecord {
  date: string; // ISO format YYYY-MM-DD
  tasks: DailyTask[];
  nutrition: NutritionItem[];
  hydration: HydrationData;
  sleep: SleepData;
  notes?: string;
}

export interface AppState {
  records: Record<string, DailyRecord>;
}

export interface WeeklyFocus {
  week: number;
  title: string;
  drills: string[];
  description: string;
}

export interface SkaterProfile {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
}
