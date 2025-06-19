import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays } from 'date-fns';
import { useNutritionStore } from '../store/nutritionStore';
import { AlertTriangle, TrendingUp, Apple } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function NutritionDashboard() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { getDailyLogs, getWeeklyLogs, getMonthlyLogs, getDeficiencies, dietPlan } = useNutritionStore();

  const endDate = new Date();
  const logs = {
    daily: getDailyLogs(endDate),
    weekly: getWeeklyLogs(endDate),
    monthly: getMonthlyLogs(endDate),
  }[timeframe];

  const deficiencies = getDeficiencies();

  const chartData = {
    labels: logs.map(log => format(new Date(log.date), 'MMM d, yyyy')),
    datasets: [
      {
        label: 'Calories',
        data: logs.map(log => log.calories),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Protein (g)',
        data: logs.map(log => log.protein),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Nutrition Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 rounded ${
              timeframe === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded ${
              timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded ${
              timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Line data={chartData} />
      </div>

      {deficiencies.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="flex items-center text-xl font-semibold text-yellow-800 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Nutritional Deficiencies
          </h3>
          <div className="space-y-4">
            {deficiencies.map((def, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-yellow-700">
                  {def.nutrient}: {def.current.toFixed(1)} / {def.target.toFixed(1)}
                </h4>
                <ul className="mt-2 space-y-1">
                  {def.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Apple className="w-4 h-4 mr-2 text-green-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {dietPlan && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="flex items-center text-xl font-semibold mb-4">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Your Diet Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Daily Targets</h4>
              <ul className="space-y-2">
                <li>Calories: {dietPlan.dailyCalories} kcal</li>
                <li>Protein: {dietPlan.macroSplit.protein}g</li>
                <li>Carbs: {dietPlan.macroSplit.carbs}g</li>
                <li>Fat: {dietPlan.macroSplit.fat}g</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommended Foods</h4>
              <div className="space-y-3">
                {dietPlan.recommendations.map((rec, index) => (
                  <div key={index}>
                    <h5 className="text-sm font-medium text-gray-700">{rec.category}</h5>
                    <p className="text-sm text-gray-600">{rec.foods.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}