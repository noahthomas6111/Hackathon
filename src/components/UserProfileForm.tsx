import React, { useState } from 'react';
import { useNutritionStore } from '../store/nutritionStore';
import { UserProfile } from '../types';
import { generateDietPlan } from '../lib/gemini';
import { UserCircle2 } from 'lucide-react';

export function UserProfileForm() {
  const { userProfile, updateProfile, updateDietPlan } = useNutritionStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UserProfile>(userProfile || {
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
    dietaryRestrictions: [],
    goals: 'maintain',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      updateProfile(formData);
      const plan = await generateDietPlan(formData);
      updateDietPlan(plan);
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <UserCircle2 className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-semibold">Your Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as UserProfile['activityLevel'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="active">Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Goals</label>
            <select
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value as UserProfile['goals'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="maintain">Maintain Weight</option>
              <option value="lose">Lose Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
          <div className="mt-2 space-x-4">
            {['vegetarian', 'vegan', 'gluten-free', 'dairy-free'].map((restriction) => (
              <label key={restriction} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dietaryRestrictions.includes(restriction)}
                  onChange={(e) => {
                    const restrictions = e.target.checked
                      ? [...formData.dietaryRestrictions, restriction]
                      : formData.dietaryRestrictions.filter((r) => r !== restriction);
                    setFormData({ ...formData, dietaryRestrictions: restrictions });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{restriction}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Generating Diet Plan...' : 'Update Profile & Generate Diet Plan'}
        </button>
      </form>
    </div>
  );
}