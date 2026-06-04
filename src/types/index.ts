export type TaskStatus = 'pending' | 'completed';
export type DayType = 'training' | 'rest' | 'sick' | 'travel';

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
  type: DayType;
  templateId?: string; // Links back to template used to generate this record
  drills: string[]; // Custom drills for this day
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

export interface DailyTemplate {
  id: string;
  name: string;
  type: DayType;
  tasks: Omit<DailyTask, 'id' | 'completed'>[];
  nutrition: Omit<NutritionItem, 'id' | 'completed'>[];
  drills: string[];
  hydrationTarget: number;
}

export interface RoutineSnippet {
  id: string;
  name: string;
  tasks: Omit<DailyTask, 'id' | 'completed'>[];
}

export interface MealPlanSnippet {
  id: string;
  name: string;
  nutrition: Omit<NutritionItem, 'id' | 'completed'>[];
}

export interface DrillSetSnippet {
  id: string;
  name: string;
  drills: string[];
}

export interface SkaterProfile {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  templates: DailyTemplate[];
  schedule: Record<string, string>; // YYYY-MM-DD -> templateId
  library: {
    routines: RoutineSnippet[];
    mealPlans: MealPlanSnippet[];
    drillSets: DrillSetSnippet[];
  };
}
