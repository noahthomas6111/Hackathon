import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NutritionLog, UserProfile, DietPlan } from '../types';
import { startOfDay, subDays, isWithinInterval } from 'date-fns';

interface NutritionStore {
  logs: NutritionLog[];
  userProfile?: UserProfile;
  dietPlan?: DietPlan;
  addLog: (log: Omit<NutritionLog, 'date'>) => void;
  updateProfile: (profile: UserProfile) => void;
  updateDietPlan: (plan: DietPlan) => void;
  getDailyLogs: (date: Date) => NutritionLog[];
  getWeeklyLogs: (endDate: Date) => NutritionLog[];
  getMonthlyLogs: (endDate: Date) => NutritionLog[];
  getDeficiencies: () => {
    nutrient: string;
    current: number;
    target: number;
    recommendations: string[];
  }[];
}

export const useNutritionStore = create<NutritionStore>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (log) => {
        set((state) => ({
          logs: [...state.logs, { ...log, date: new Date() }],
        }));
      },
      updateProfile: (profile) => {
        set({ userProfile: profile });
      },
      updateDietPlan: (plan) => {
        set({ dietPlan: plan });
      },
      getDailyLogs: (date) => {
        const targetDate = startOfDay(date);
        return get().logs.filter(
          (log) => startOfDay(new Date(log.date)).getTime() === targetDate.getTime()
        );
      },
      getWeeklyLogs: (endDate) => {
        const startDate = subDays(endDate, 7);
        return get().logs.filter((log) =>
          isWithinInterval(new Date(log.date), { start: startDate, end: endDate })
        );
      },
      getMonthlyLogs: (endDate) => {
        const startDate = subDays(endDate, 30);
        return get().logs.filter((log) =>
          isWithinInterval(new Date(log.date), { start: startDate, end: endDate })
        );
      },
      getDeficiencies: () => {
        const profile = get().userProfile;
        const plan = get().dietPlan;
        if (!profile || !plan) return [];

        const todayLogs = get().getDailyLogs(new Date());
        const totals = todayLogs.reduce(
          (acc, log) => ({
            calories: acc.calories + log.calories,
            protein: acc.protein + log.protein,
            carbs: acc.carbs + log.carbs,
            fat: acc.fat + log.fat,
            fiber: acc.fiber + log.fiber,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        );

        const deficiencies = [];

        if (totals.calories < plan.dailyCalories * 0.9) {
          deficiencies.push({
            nutrient: 'Calories',
            current: totals.calories,
            target: plan.dailyCalories,
            recommendations: [
              'Add healthy snacks between meals',
              'Include more healthy fats like nuts and avocados',
              'Increase portion sizes slightly',
            ],
          });
        }

        if (totals.protein < plan.macroSplit.protein * 0.9) {
          deficiencies.push({
            nutrient: 'Protein',
            current: totals.protein,
            target: plan.macroSplit.protein,
            recommendations: [
              'Add lean meats to meals',
              'Include more legumes and beans',
              'Consider Greek yogurt for snacks',
            ],
          });
        }

        return deficiencies;
      },
    }),
    {
      name: 'nutrition-storage',
    }
  )
);